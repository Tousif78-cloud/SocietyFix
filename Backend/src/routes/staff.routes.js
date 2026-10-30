import { Router } from 'express';
import { addStaff, bulkStaff, listStaff } from '../controllers/staff.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(requireAuth); router.get('/',allowRoles('Admin'),asyncHandler(listStaff)); router.post('/',allowRoles('Admin'),asyncHandler(addStaff)); router.put('/bulk',allowRoles('Admin'),asyncHandler(bulkStaff)); export default router;
