import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Nav from "./components/client/Nav";
import LoggedInNav from "./components/client/LoggedInNav";
import 'react-toastify/dist/ReactToastify.css';
import {
  Footer,
  Hero
} from "./sections/client";
import ProtectedRoute from './components/ProtectedRoute';
import Home from "./components/client/Home";
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
import Shopping from './components/client/Shopping';
import ItemDetails from './components/client/ItemDetails';
import EditPassword from './components/client/EditPassword';
import ForgotPassword from './components/client/ForgotPassword';
import ResetPassword from './components/client/ResetPassword';
import Cart from './components/client/Cart';
const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const updateLoginState = () => setLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("loginStateChange", updateLoginState);
    updateLoginState(); // Update login state when component mounts

    return () => {
      window.removeEventListener("loginStateChange", updateLoginState);
    };
  }, []);

  return (
    <Router>
      <div>
        <ToastContainer /> 
        <Routes>
          <Route path="/admin/*" element={<Dashboard />} /> 
          <Route path="*" element={
            <>
              {loggedIn ? <LoggedInNav /> : <Nav />}
              <main className="relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/login" element={<Login />}/>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} /> 
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  {/* Use ProtectedRoute as a wrapper */}
                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/edit-profile" element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/edit-password" element={
                    <ProtectedRoute>
                      <EditPassword />
                    </ProtectedRoute>
                  } />
                   <Route path="/shopping" element={
                    <ProtectedRoute>
                      <Shopping />
                    </ProtectedRoute>
                  } />
                   <Route path="/item-details/:productId" element={
                    <ProtectedRoute>
                      <ItemDetails />
                    </ProtectedRoute>
                  } />
                   <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
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