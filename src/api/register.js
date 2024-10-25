import apiInstance from './axios';

export function register(user){
    return apiInstance.post("/register",user)
}