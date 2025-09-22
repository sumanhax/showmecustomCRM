import { toast } from 'react-toastify';

export const showToast = (message, type) => {
  console.log('message in toaster', message);
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    progress: undefined,
    theme: 'light',
  });
};
