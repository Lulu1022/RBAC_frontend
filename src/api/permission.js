import apiInstance from './axios';

export function getAllPermissions() {
  return apiInstance.get("/permissions")
}

export function assignPermission(roleId,permissionList) {
  return apiInstance.post(`/roles/${roleId}/permissions`, permissionList)
}
export function getPermissionsByRole(roleId) {
  return apiInstance.get(`/roles/${roleId}/permissions`)
}

export function getTreeleftnodes(roleId) {
  return apiInstance.get(`/roles/${roleId}/treepermissions`)
}


export function getMenuPermissions(roleId) {
  return apiInstance.get(`/roles/menupermission`, {
    params: {
      roleId: roleId
    }
  });
}

export function deletePermissionsByRole(roleId) {
  return apiInstance.delete(`/roles/${roleId}/permissions`)
}

