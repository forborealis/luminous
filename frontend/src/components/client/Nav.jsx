import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { navLinks } from "../../constants";
import { useLocation } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('loginStateChange')); 
    navigate("/login");
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("loginStateChange", () => {
      setLoggedIn(!!localStorage.getItem("token"));
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("loginStateChange", () => {
        setLoggedIn(!!localStorage.getItem("token"));
      });
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false); 
  }, [location]);

  return (
    <header
      className={`px-4 py-3 bg-customColor text-white sticky top-0 z-50 ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-semibold">
          <img src={headerLogo} alt="logo" className="w-32" />
        </Link>
        <ul className="hidden space-x-6 lg:flex">
          <li>
            <Link
              to="/products"
              className="hover:text-coral-red transition duration-300"
            >
              Products
            </Link>
          </li>
        </ul>
        {loggedIn ? (
          <div className="flex space-x-4 items-center relative">
            <div className="relative">
              <span
                className="cursor-pointer text-white hover:text-coral-red transition duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Profile
              </span>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/edit-password"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit Password
                  </Link>
                </div>
              )}
            </div>
            <button
              className="text-white hover:text-coral-red transition duration-300"
              onClick={handleSignOut}
            >
              <ExitToAppIcon />
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex space-x-4 items-center">
            <Link
              to="/login"
              className="hover:text-coral-red transition duration-300"
            >
              Login
            </Link>
          </div>
        )}
        <div className="lg:hidden">
          {loggedIn ? (
            <button
              className="text-white"
              onClick={handleSignOut}
            >
              <img src={hamburger} alt="hamburger icon" className="w-6 h-6" />
            </button>
          ) : (
            <Link to="/login" className="text-white">
              <img src={hamburger} alt="hamburger icon" className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;