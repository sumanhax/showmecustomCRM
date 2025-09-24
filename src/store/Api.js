import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
let domain = window.location.origin
const formDataURL = ['/api/admin/dashboard/add-rep', '/api/admin/dashboard/add-manager'];
api.interceptors.request.use((req) => {
  let userTokenData;
  try {
    userTokenData = JSON.parse(sessionStorage.getItem('crm_login_token'));
    // console.log("UserTokenData", userTokenData);
  } catch (error) {
    userTokenData = null;
  }
  let token = userTokenData && userTokenData.access_token ? userTokenData.access_token : null;
  // console.log("Req: ", req.url);
  req.headers['Content-Type'] = 'application/json';
  // if (formDataURL.includes(req.url)) {
  //   req.headers['Content-Type'] = 'multipart/form-data';
  // }
  if (formDataURL.some(url => req.url.startsWith(url))) {
    req.headers['Content-Type'] = 'multipart/form-data';
  }
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (domain) {
    req.headers['Domain'] = domain;
  }
  return req;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      sessionStorage.removeItem('crm_login_token');
    }
    return Promise.reject(error);
  }
);

export default api;
