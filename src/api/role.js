import apiInstance from './axios';

  export function fetchAllRoles(){
    return apiInstance.get('/roles')
  }

  export function addRole(role){
    return apiInstance.post("/roles",role)
  }

  export function deleteRole(roleId){
    return apiInstance.delete(`/roles/${roleId}`)
  }

  export function getRole(id){
    return apiInstance.get(`/roles/${id}`)
  }

  export function updateRole(id,role){
    return apiInstance.put(`/roles/${id}`,role)
  }


  
