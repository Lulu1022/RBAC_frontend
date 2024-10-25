import apiInstance from './axios';


export function getMenu() {
    return apiInstance.get("/api/menu");
}
