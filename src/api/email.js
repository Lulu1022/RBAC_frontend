import apiInstance from './axios';

export async function sendMail(user){
    return apiInstance.post("/emails/send", user);
}