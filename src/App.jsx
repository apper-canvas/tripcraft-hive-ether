import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/Layout';
import { routes } from '@/config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(route => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
/>
          ))}
          <Route index element={(() => {
            if (routes?.length > 0) {
              const DefaultComponent = routes[0].component;
              return <DefaultComponent />;
            }
            return <div>Loading...</div>;
          })()} />
        </Route>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App