import apiInstance from './axios';

export function getUserList(start, pageSize) {
    const token = localStorage.getItem('token');
    console.log("成功獲取 token")
    console.log(token)


    if (!token) {
      throw new Error('缺少 token');
    }

  return apiInstance.get("/users",{
    
    params: {
      page: start,
      pageSize: pageSize
  },

  })
  
}

//新增使用者
export function addUser(user){
  return apiInstance.post("/users",user)
}

//查詢使用者
export function getUser(id){
  return apiInstance.get("/users/" + id)
}



export function editUser(id,user){
  return apiInstance.put(`/users`,user)
}

//刪除使用者
export function deleteUser(id){
  return apiInstance.delete("/users", {
    params: {
      userId: id
    }
  });
}


export function updateUserStatus(id, status) {
  return apiInstance.put(`/users/${id}/status`, null, {
    params: {
      status: status
    }
  });
}

export function getPermissionByUserid(userId){

  return apiInstance.get(`/users/${userId}/permissions`);
}


export function getPermissionPathByUserid(userId){

  return apiInstance.get(`/users/${userId}/permissions/path`);
}


