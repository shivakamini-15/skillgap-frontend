import api from './axios';

const data = (promise) => promise.then((r) => r.data);

export const authApi = {
  login: (body) => data(api.post('/auth/login', body)),
  register: (body) => data(api.post('/auth/register', body)),
};

export const catalogApi = {
  skills: () => data(api.get('/catalog/skills')),
  roles: () => data(api.get('/catalog/roles')),
};

export const studentApi = {
  profile: () => data(api.get('/student/profile')),
  updateProfile: (body) => data(api.put('/student/profile', body)),
  setTarget: (roleId) => data(api.put(`/student/target-role/${roleId}`)),
  skills: () => data(api.get('/student/skills')),
  saveSkill: (body) => data(api.post('/student/skills', body)),
  removeSkill: (skillId) => data(api.delete(`/student/skills/${skillId}`)),
  gap: () => data(api.get('/student/analysis/gap')),
  runAnalysis: () => data(api.post('/student/analysis/run')),
  alignment: () => data(api.get('/student/alignment')),
  generateRoadmap: () => data(api.post('/student/roadmap/generate')),
  roadmap: () => data(api.get('/student/roadmap')),
  completeStep: (id) => data(api.put(`/student/roadmap/${id}/complete`)),
  progress: () => data(api.get('/student/progress')),
};

export const adminApi = {
  createRole: (body) => data(api.post('/admin/roles', body)),
  updateRole: (id, body) => data(api.put(`/admin/roles/${id}`, body)),
  deleteRole: (id) => data(api.delete(`/admin/roles/${id}`)),
  setRoleSkills: (id, body) => data(api.put(`/admin/roles/${id}/skills`, body)),
  createSkill: (body) => data(api.post('/admin/skills', body)),
  deleteSkill: (id) => data(api.delete(`/admin/skills/${id}`)),
  resources: () => data(api.get('/admin/resources')),
  createResource: (body) => data(api.post('/admin/resources', body)),
  deleteResource: (id) => data(api.delete(`/admin/resources/${id}`)),
  gapAnalytics: () => data(api.get('/admin/analytics/gaps')),
};
