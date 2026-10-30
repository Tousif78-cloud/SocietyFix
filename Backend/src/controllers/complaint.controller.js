import { store, persistStore } from '../models/store.js';
import { createComplaint, updateComplaint } from '../services/complaint.service.js';
import { validateComplaint } from '../validators/complaint.validator.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
function visibleTo(user, c) { return user.role === 'Admin' || (user.role === 'Resident' && (c.residentId === user.id || c.residentEmail === user.email)) || (user.role === 'Staff' && c.assignedTo === user.email); }
export function listComplaints(req, res) { let items = store.complaints.filter(c => visibleTo(req.user, c)); if (req.user.role === 'Staff') items = items.filter(c => c.assignedTo === req.user.email); if (req.user.role === 'Resident') items = items.filter(c => c.residentId === req.user.id || c.residentEmail === req.user.email); return ok(res, items); }
export function getComplaint(req, res) { const c = store.complaints.find(x => x.id === req.params.id); if (!c) throw new ApiError(404, 'Complaint not found.'); if (!visibleTo(req.user, c)) throw new ApiError(403, 'You cannot view this complaint.'); return ok(res, c); }
export function create(req, res) { const problem = validateComplaint(req.body); if (problem) throw new ApiError(400, problem); return ok(res, createComplaint(req.body, req.user), 201); }
export function update(req, res) {
  const c = store.complaints.find(x => x.id === req.params.id); if (!c) throw new ApiError(404, 'Complaint not found.');
  const isAdmin = req.user.role === 'Admin'; const isAssignedStaff = req.user.role === 'Staff' && c.assignedTo === req.user.email;
  if (!isAdmin && !isAssignedStaff) throw new ApiError(403, 'Only Admin or the assigned Staff member can update this complaint.');
  if (req.body.status && !['Open', 'Assigned', 'In progress', 'Resolved', 'Closed'].includes(req.body.status)) throw new ApiError(400, 'Invalid complaint status.');
  if (req.user.role === 'Staff' && req.body.assignedTo !== undefined) throw new ApiError(403, 'Staff cannot reassign complaints.');
  if (req.user.role === 'Staff' && req.body.status === 'Closed') throw new ApiError(403, 'Staff cannot close complaints.');
  const updated=updateComplaint(c,req.body,req.user);persistStore();return ok(res,updated);
}
export function history(req, res) { const c = store.complaints.find(x => x.id === req.params.id); if (!c || !visibleTo(req.user, c)) throw new ApiError(404, 'Complaint or history not found.'); return ok(res, store.history.filter(h => h.complaintId === c.id)); }
