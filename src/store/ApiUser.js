import axios from 'axios';
const apiUser = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL_USER });
let domain = window.location.origin
const formDataURL = [];
apiUser.interceptors.request.use((req) => {
  let userTokenData;
  try {
    userTokenData = JSON.parse(sessionStorage.getItem('crm_login_token'));
    // console.log("UserTokenData", userTokenData);
  } catch (error) {
    userTokenData = null;
  }
  let token = userTokenData && userTokenData.access_token ? userTokenData.access_token : null;
  // console.log("Req: ", req.url);
  
  // Check if the request data is FormData
  if (req.data instanceof FormData) {
    req.headers['Content-Type'] = 'multipart/form-data';
  } else {
    req.headers['Content-Type'] = 'application/json';
  }
  
  // Legacy support for formDataURL array
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

apiUser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      sessionStorage.removeItem('crm_login_token');
    }
    return Promise.reject(error);
  }
);

export default apiUser;
