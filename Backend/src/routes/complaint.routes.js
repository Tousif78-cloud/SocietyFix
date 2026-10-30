import { Router } from 'express';
import { create, getComplaint, history, listComplaints, update } from '../controllers/complaint.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import { validateImageData } from '../middleware/upload.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(requireAuth); router.get('/',asyncHandler(listComplaints)); router.post('/',allowRoles('Resident'),validateImageData,asyncHandler(create)); router.get('/:id/history',asyncHandler(history)); router.get('/:id',asyncHandler(getComplaint)); router.patch('/:id',allowRoles('Admin','Staff'),validateImageData,asyncHandler(update)); router.patch('/:id/status',allowRoles('Admin','Staff'),asyncHandler(update)); router.patch('/:id/assign',allowRoles('Admin'),asyncHandler(update)); router.post('/:id/resolution',allowRoles('Staff'),validateImageData,asyncHandler(update)); export default router;
