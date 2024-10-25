import apiInstance from './axios';


export async function upload(file, formId){
    return apiInstance.post("/file/upload",file, {
        params: {
            formId: formId
      },
      });
}

export async function getFileInfo(formId) {
    return apiInstance.get(`/file/${formId}`);
}


