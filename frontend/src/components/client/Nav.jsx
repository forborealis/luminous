import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    setIsDropdownOpen(false); 
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery(''); // Clear the search bar after navigation
    }
  };

  return (
    <header
      className={`px-4 py-3 bg-customColor text-white sticky top-0 z-50 ${isScrolled ? "scrolled" : ""} font-montserrat`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-semibold">
          <img src={headerLogo} alt="logo" className="w-32" />
        </Link>
        <ul className="hidden lg:flex justify-center flex-1 space-x-6">
          <li>
            <Link
              to="/"
              className="hover:text-coral-red transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="hover:text-coral-red transition duration-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="hover:text-coral-red transition duration-300"
            >
              About Us
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4 ml-auto">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-6 py-1 border rounded text-black"
            />
          </form>
          <Link
            to="/login"
            className="text-white hover:text-coral-red transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;