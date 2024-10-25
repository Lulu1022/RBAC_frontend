import apiInstance from './axios';

export function login(user) {
  return apiInstance.post("/login",user);
}

