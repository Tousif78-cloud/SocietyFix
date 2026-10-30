import { randomUUID } from 'node:crypto';
import { store, persistStore } from '../models/store.js';
import { notify } from './notification.service.js';
export function recordHistory(complaint, actor, action, previousStatus, newStatus, note = '') {
  store.history.unshift({ id: randomUUID(), complaintId: complaint.id, actorId: actor?.id || null, actorEmail: actor?.email || 'system', action, previousStatus, newStatus, note, createdAt: new Date().toISOString() });
}
export function createComplaint(body, user) {
  const now = new Date().toISOString();
  const complaint = {
    ...body,
    id: body.id || `CMP-${Date.now().toString().slice(-7)}`,
    title: String(body.title).trim(), description: String(body.description).trim(),
    resident: user.name, residentEmail: user.email, residentId: user.id,
    flat: body.flat || user.flat || 'Not set', assignedTo: '',
    status: 'Open', createdAt: now,
    date: new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    complaintPhoto: body.complaintPhoto || '', resolutionPhoto: '', resolutionNote: '',
  };
  store.complaints.unshift(complaint);
  recordHistory(complaint, user, 'created', null, 'Open');
  store.users.filter(u => u.role === 'Admin').forEach(u => notify(u.id, complaint.id, 'complaint-created', 'New complaint', `${complaint.title} was submitted by ${user.name}.`));
  persistStore();
  return complaint;
}
export function updateComplaint(complaint, updates, actor) {
  const previousStatus = complaint.status;
  const allowed = ['status', 'assignedTo', 'assignedAt', 'resolutionPhoto', 'resolutionNote', 'title', 'category', 'priority', 'description', 'complaintPhoto', 'flat'];
  for (const key of allowed) if (updates[key] !== undefined) complaint[key] = updates[key];
  complaint.updatedAt = new Date().toISOString();
  if (complaint.status === 'Resolved') complaint.resolvedAt = complaint.updatedAt;
  recordHistory(complaint, actor, 'updated', previousStatus, complaint.status, updates.resolutionNote || '');
  const assignedStaff = store.users.find(u => u.email === complaint.assignedTo && u.role === 'Staff');
  if (assignedStaff && complaint.assignedTo !== actor.email) notify(assignedStaff.id, complaint.id, 'complaint-assigned', 'Complaint assigned', `${complaint.id}: ${complaint.title}`);
  const resident = store.users.find(u => u.id === complaint.residentId || u.email === complaint.residentEmail);
  if (resident && previousStatus !== complaint.status) notify(resident.id, complaint.id, 'status-updated', 'Complaint status updated', `${complaint.id} is now ${complaint.status}.`);
  store.users.filter(u => u.role === 'Admin' && u.id !== actor.id && previousStatus !== complaint.status).forEach(u => notify(u.id, complaint.id, 'status-updated', 'Complaint status updated', `${complaint.id} is now ${complaint.status}.`));
  if (actor.role === 'Staff') store.users.filter(u => u.role === 'Admin' && u.status === 'Active').forEach(u => notify(u.id, complaint.id, 'staff-work-update', 'Staff work update', `${actor.name} updated ${complaint.id}: ${updates.resolutionNote || complaint.status}.`));
  persistStore();
  return complaint;
}
