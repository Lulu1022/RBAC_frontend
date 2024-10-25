import apiInstance from './axios';


export function getFormsByUserIdAndReviewStatus(userId,reviewStatus) {
    return apiInstance.get(`/form/${reviewStatus}`,{
        params: {
          userId: userId
      },
      });
}


export function getForms(start, pageSize, review_status) {
    return apiInstance.get("/form",{
        params: {
          page: start,
          pageSize: pageSize,
          review_status: review_status
      },
    
      });
}


export function addForm(form,userId){
  
    return apiInstance.post("/form",form,{
        params: {
          userId: userId
      },
    
      });
  }

export function changeReviewStatus(id, status) {
return apiInstance.put(`/form/${id}`,null, {
    params: { review_status : status } 
});
}
