import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AllRoutes from './routes/RoutesConfig';
import './App.css';
import './assets/css/custom.css';
import { ToastContainer } from 'react-toastify';
function App() {
  const allRoutes = createBrowserRouter(AllRoutes);
  return (
    <>
      {' '}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme='light'
      />
      <RouterProvider router={allRoutes} />
    </>
  );
}

export default App;
