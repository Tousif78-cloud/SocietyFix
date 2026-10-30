import { Router } from 'express';
import { listUsers, accessRequests, decideAccess, leaveAdminPosition } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();router.use(requireAuth,allowRoles('Admin'));router.post('/leave',asyncHandler(leaveAdminPosition));router.get('/users',asyncHandler(listUsers));router.get('/access-requests',asyncHandler(accessRequests));router.patch('/access-requests/:id',asyncHandler(decideAccess));export default router;
