import axios from 'axios';
const newApi = axios.create({ baseURL: import.meta.env.VITE_API_NEW_URL });
let domain = window.location.origin

const formDataURL = [
    '/api/logo-placement/save',
    '/api/banners/save',
    '/api/admin/leads/image-upload',
    '/api/hats/',
];


const jsonOnlyURL = [
    '/api/hats/variants/',
    '/api/colors/',
    '/api/hats/colors/'

];

newApi.interceptors.request.use((req) => {
    let userTokenData;
    try {
        userTokenData = JSON.parse(sessionStorage.getItem('crm_login_token'));
    } catch (error) {
        userTokenData = null;
    }
    let token = userTokenData && userTokenData.access_token ? userTokenData.access_token : null;

    req.headers['Content-Type'] = 'application/json';

    const isJsonOnly = jsonOnlyURL.some(url => req.url.startsWith(url));
    const isFormData = formDataURL.some(url => req.url.startsWith(url));

    if (isFormData && !isJsonOnly) {
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

newApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            sessionStorage.removeItem('crm_login_token');
        }
        return Promise.reject(error);
    }
);

export default newApi;

// import axios from 'axios';
// const newApi = axios.create({ baseURL: import.meta.env.VITE_API_NEW_URL });
// let domain = window.location.origin
// const formDataURL = [
//     '/api/logo-placement/save',
//     '/api/banners/save',
//     '/api/admin/leads/image-upload',
//     '/api/hats/',

// ];
// newApi.interceptors.request.use((req) => {
//     let userTokenData;
//     try {
//         userTokenData = JSON.parse(sessionStorage.getItem('crm_login_token'));
//         // console.log("UserTokenData", userTokenData);
//     } catch (error) {
//         userTokenData = null;
//     }
//     let token = userTokenData && userTokenData.access_token ? userTokenData.access_token : null;
//     // console.log("Req: ", req.url);
//     req.headers['Content-Type'] = 'application/json';
//     // if (formDataURL.includes(req.url)) {
//     //   req.headers['Content-Type'] = 'multipart/form-data';
//     // }
//     if (formDataURL.some(url => req.url.startsWith(url))) {
//         req.headers['Content-Type'] = 'multipart/form-data';
//     }
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     if (domain) {
//         req.headers['Domain'] = domain;
//     }
//     return req;
// });

// newApi.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && [401, 403].includes(error.response.status)) {
//             sessionStorage.removeItem('crm_login_token');
//         }
//         return Promise.reject(error);
//     }
// );

// export default newApi;
