/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from 'react-router-dom';
const errorHandler = (errorsData) => {
  // console.log('errorsData', errorsData);
  let errors = {};
  errors.message = 'Something went wrong. Please try again later.';
  let statusCode = errorsData?.response?.status
    ? errorsData.response.status
    : undefined;

  // const navigate = useNavigate();
  if (statusCode) {
    switch (statusCode) {
      case 400:
        errors.status_code = errorsData?.response?.status
        errors.message = errorsData?.response?.data?.message
          ? errorsData.response?.data?.message
          : 'Validation error';
        break;
      case 401:
        localStorage.removeItem('adminToken');
        // navigate('/');
        errors.status_code = errorsData?.response?.status
        errors.message = errorsData?.response?.data?.message
          ? errorsData.response?.data?.message
          : 'Validation error';
        break;
      case 403:
        break;
      case 422:
        errors.message = errorsData?.response?.data?.message
          ? errorsData.response.data.message
          : 'Validation error';
        break;
      case 429:
        errors.message = errorsData?.response?.data?.errors
          ? errorsData.response.data.errors
          : 'Too many requests';
        break;
      default:
        errors.message = errorsData?.response?.data?.message
          ? errorsData.response?.data?.message
          : 'Something went wrong. Please try again later';
        break;
    }
  } else if (errorsData.code === 'ERR_NETWORK') {
    errors.message = 'API server network error';
  }

  return errors;
};
const navigateOnUnauthorized = () => {
  const navigate = useNavigate();
  navigate('/');
};
export default errorHandler;
