import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/client/Nav";
import {
  Footer,
  Hero
} from "./sections/client";
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./components/client/Login";
import Signup from "./components/client/Signup";
import Products from "./components/client/Products";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import VerifyEmail from './components/client/VerifyEmail';
import Dashboard from "./components/server/Dashboard"; 
import Shop from './components/client/Shop';
import EditProfile from './components/client/EditProfile';
import Profile from './components/client/Profile';
import EditPassword from './components/client/EditPassword';

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer /> 
        <Routes>
          <Route path="/admin/*" element={<Dashboard />} /> 
          <Route path="*" element={
            <>
              <Nav /> 
              <main className="relative">
                <Routes>
                  <Route path="/" element={
                    <>
                      <section className="xl:padding-l wide:padding-r padding-b">
                        <Hero />
                      </section>
                      <Footer /> 
                    </>
                  } />
                  <Route path="/products" element={<Products />} />
                  <Route path="/login" element={<Login />}/>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} /> 
                  <Route path="/shop" element={<ProtectedRoute element={<Shop />} />} />
                  <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                  <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} />} />
                  <Route path="/edit-password" element={<ProtectedRoute element={<EditPassword />} />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;