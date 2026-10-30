// Backend-connected service layer. No complaint/staff records are written to browser localStorage.
const API = "/api/v1";
let complaintsCache = [];
let staffCache = [];
let complaintsLoaded = false;
let staffLoaded = false;
export const COMPLAINTS_KEY = "societycare_complaints"; // legacy constant only; not used for storage
export const STAFF_KEY = "societyfix_staff"; // legacy constant only; not used for storage
export const ASSIGNMENTS_EVENT = "societyfix:assignments-updated";
export const demoComplaints = [];
export const demoStaff = [
 {id:"demo-staff-1",name:"Rohan Patil",role:"Maintenance",email:"rohan@society.demo",phone:"",status:"Active"},
 {id:"demo-staff-2",name:"Priya Nair",role:"Electrician",email:"priya@society.demo",phone:"",status:"Active"},
 {id:"demo-staff-3",name:"Imran Shaikh",role:"Plumber",email:"imran@society.demo",phone:"",status:"On leave"}
];
async function request(path, options = {}) {
 const response = await fetch(`${API}${path}`, { credentials: "include", ...options, headers: { ...(options.body instanceof FormData ? {} : {"Content-Type":"application/json"}), ...(options.headers||{}) } });
 const result = await response.json().catch(()=>({}));
 if (!response.ok) throw new Error(result.message || `Request failed (${response.status})`);
 return result.data;
}
const json = value => JSON.stringify(value);
function dispatchComplaints(){window.dispatchEvent(new Event("societycare:complaints-updated"));window.dispatchEvent(new Event(ASSIGNMENTS_EVENT));}
function dispatchStaff(){window.dispatchEvent(new Event("societyfix:staff-updated"));}
export function getComplaints(){return complaintsCache;}
export function getComplaintById(id){return complaintsCache.find(c=>String(c.id)===String(id))||null;}
export function getStaff(){return staffCache;}
export async function refreshComplaints(){try{complaintsCache=await request("/complaints");complaintsLoaded=true;dispatchComplaints();return complaintsCache;}catch(error){console.warn("Could not load complaints from backend:",error.message);return complaintsCache;}}
export async function refreshStaff(){try{staffCache=await request("/staff");staffLoaded=true;dispatchStaff();return staffCache;}catch(error){console.warn("Could not load staff from backend:",error.message);return staffCache;}}
export function saveComplaints(items){
 const previous=complaintsCache; complaintsCache=Array.isArray(items)?items:[]; dispatchComplaints();
 return (async()=>{
   try {
     const before=new Map(previous.map(c=>[String(c.id),c]));
     for(const item of complaintsCache){
       const old=before.get(String(item.id));
       if(!old){const created=await request("/complaints",{method:"POST",body:json(item)});const index=complaintsCache.findIndex(c=>String(c.id)===String(item.id));if(index>=0)complaintsCache[index]={...item,...created};}
       else {const delta={};for(const key of Object.keys(item)){if(json(item[key])!==json(old[key]))delta[key]=item[key];}if(Object.keys(delta).length)await request(`/complaints/${encodeURIComponent(item.id)}`,{method:"PATCH",body:json(delta)});}
     }
     await refreshComplaints();
   } catch(error) { console.error("Complaint sync failed:",error.message); window.dispatchEvent(new CustomEvent("societyfix:api-error",{detail:error.message})); }
 })();
}
export function saveStaff(items){
 const previous=staffCache; staffCache=Array.isArray(items)?items:[]; dispatchStaff();
 (async()=>{try{await request("/staff/bulk",{method:"PUT",body:json({staff:staffCache})});await refreshStaff();}catch(error){console.error("Staff sync failed:",error.message);window.dispatchEvent(new CustomEvent("societyfix:api-error",{detail:error.message}));}})();
}
export async function registerAccount(profile){return request("/auth/register",{method:"POST",body:json(profile)});}
export async function loginAccount(credentials){return request("/auth/login",{method:"POST",body:json(credentials)});}
export async function getCurrentUser(){return request("/auth/me");}
export async function logoutAccount(){try{return await request("/auth/logout",{method:"POST",body:json({})});}finally{complaintsCache=[];staffCache=[];complaintsLoaded=false;staffLoaded=false;dispatchComplaints();dispatchStaff();}}
export async function getNotifications(){return request("/notifications");}
export async function markNotificationRead(id){return request(`/notifications/${encodeURIComponent(id)}/read`,{method:"PATCH",body:json({})});}
export async function markAllNotificationsRead(){return request("/notifications/read-all",{method:"PATCH",body:json({})});}
// Hydrate the shared in-memory view once when the app imports this module.
if(typeof window!=="undefined"){refreshComplaints();}

export async function getAccessRequests(){return request("/admin/access-requests");}
export async function decideAccessRequest(id,decision){return request(`/admin/access-requests/${encodeURIComponent(id)}`,{method:"PATCH",body:json({decision,confirmedByAdmin:true})});}

export async function leaveAdminPosition(){return request('/admin/leave',{method:'POST',body:json({})});}
