import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const LoggedInNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('loginStateChange')); 
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart"); // Navigate to the cart page
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleLoginStateChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);

    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, []);

  return (
    <header
      className={`px-4 py-3 bg-customColor text-white sticky top-0 z-50 ${isScrolled ? "scrolled" : ""} font-montserrat`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/shop" className="text-2xl font-semibold">
          <img src={headerLogo} alt="logo" className="w-32" />
        </Link>
        <ul className="hidden space-x-6 lg:flex">
        <li>
            <Link
              to="/shop"
              className="hover:text-coral-red transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shopping"
              className="hover:text-coral-red transition duration-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/order"
              className="hover:text-coral-red transition duration-300"
            >
              My Orders
            </Link>
          </li>
        </ul>
        <div className="flex space-x-4 items-center relative">
          {isLoggedIn && (
            <>
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
                onClick={handleCartClick}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button
                className="text-white hover:text-coral-red transition duration-300"
                onClick={handleSignOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </>
          )}
        </div>
        <div className="lg:hidden">
          <button
            className="text-white"
            onClick={handleSignOut}
          >
            <img src={hamburger} alt="hamburger icon" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default LoggedInNav;