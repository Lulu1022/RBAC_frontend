import axios from 'axios';

axios.defaults.withCredentials = true;
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiInstance.interceptors.request.use(config => {

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.token = `${token}`;
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {

  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default apiInstance;
