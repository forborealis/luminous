import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

const LoggedInNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shopping?search=${searchQuery}`);
    setSearchQuery(''); // Clear the search bar text after a successful search
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
        <ul className="hidden lg:flex justify-center flex-1 space-x-6">
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
          <li className="relative">
            <span
              className="cursor-pointer hover:text-coral-red transition duration-300"
              onClick={() => setIsOrdersDropdownOpen(!isOrdersDropdownOpen)}
            >
              My Orders
            </span>
            {isOrdersDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/order"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Orders
                </Link>
                <Link
                  to="/completed-order"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Completed
                </Link>
                <Link
                  to="/cancle-order"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Cancelled
                </Link>
              </div>
            )}
          </li>
        </ul>
        <div className="flex space-x-4 items-center relative ml--20">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-4 py-1 rounded-md text-black"
            />
          </form>
          {isLoggedIn && (
            <>
              <div className="relative">
                <span
                  className="cursor-pointer text-white hover:text-coral-red transition duration-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FontAwesomeIcon icon={faUser} />
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