import apiInstance from './axios';

export function captcha(recaptcha) {
    return apiInstance.post("/captcha/submit", recaptcha);
}
