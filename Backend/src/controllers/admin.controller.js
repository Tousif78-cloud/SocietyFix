import { randomUUID } from 'node:crypto';
import { UserModel } from '../models/User.js';
import { store, persistStore } from '../models/store.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
export function listUsers(req,res){return ok(res,UserModel.all());}
export function accessRequests(req,res){return ok(res,store.users.filter(u=>u.status==='Pending').map(({passwordHash,...u})=>u));}
export function decideAccess(req,res){const pending=store.users.find(u=>u.id===req.params.id&&u.status==='Pending');if(!pending)throw new ApiError(404,'Pending access request not found.');const decision=String(req.body.decision||'').toLowerCase();if(!['approve','deny'].includes(decision))throw new ApiError(400,'Decision must be approve or deny.');
 if(decision==='deny'){pending.status='Denied';persistStore();return ok(res,{decision:'denied',id:pending.id});}
 const requested=pending.requestedRole||pending.role;
 if(requested==='Admin'&&store.users.some(u=>u.role==='Admin'&&u.status==='Active')){const activeAdmins=store.users.filter(u=>u.role==='Admin'&&u.status==='Active');if(!req.body.confirmedByAdmin)throw new ApiError(403,'An existing admin must explicitly approve the second admin.');}
 if(pending.originalEmail){const existing=store.users.find(u=>u.email===pending.originalEmail);if(!existing)throw new ApiError(404,'Original account for this role request was not found.');existing.role=requested;existing.status='Active';pending.status='Approved';}
 else {pending.email=String(pending.email).replace(/#(staff|admin)-request$/,'');pending.role=requested;pending.status='Active';delete pending.requestedRole;}
 pending.approvedBy=req.user.id;pending.approvedAt=new Date().toISOString();persistStore();return ok(res,{decision:'approved',role:requested,id:pending.id});}


// An administrator may voluntarily leave the role without deleting their account or society data.
export function leaveAdminPosition(req, res) {
  const departing = store.users.find(u => u.id === req.user.id);
  if (!departing || departing.role !== 'Admin' || departing.status !== 'Active') {
    throw new ApiError(403, 'Only an active administrator can leave the admin position.');
  }

  // Keep the account active as a Resident; complaints, notifications and history are not touched.
  departing.role = 'Resident';
  departing.status = 'Active';
  departing.flat = departing.flat || 'Office';
  departing.adminLeftAt = new Date().toISOString();

  let successor = null;
  const activeAdmins = store.users.filter(u => u.role === 'Admin' && u.status === 'Active');
  if (activeAdmins.length === 0) {
    // If someone was already waiting for Admin approval, avoid leaving the system without an owner.
    const pending = store.users
      .filter(u => u.status === 'Pending' && (u.requestedRole || u.role) === 'Admin')
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))[0];
    if (pending) {
      if (pending.originalEmail) {
        successor = store.users.find(u => u.email === pending.originalEmail);
        if (successor) {
          successor.role = 'Admin';
          successor.status = 'Active';
          successor.flat = successor.flat || 'Office';
        }
        pending.status = 'Approved';
      } else {
        pending.email = String(pending.email).replace(/#admin-request$/, '');
        pending.role = 'Admin';
        pending.status = 'Active';
        delete pending.requestedRole;
        successor = pending;
      }
      pending.approvedBy = req.user.id;
      pending.approvedAt = new Date().toISOString();
    }
  }
  persistStore();
  return ok(res, {
    leftAdminPosition: true,
    user: { id: departing.id, name: departing.name, email: departing.email, role: departing.role, status: departing.status },
    successor: successor ? { id: successor.id, name: successor.name, email: successor.email, role: successor.role } : null,
    dataPreserved: true,
  });
}
