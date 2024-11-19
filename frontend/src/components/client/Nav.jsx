import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { navLinks } from "../../constants";
import { useLocation } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add this line
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

  return (
    <header
      className={`px-4 py-3 bg-customColor text-white sticky top-0 z-50 ${isScrolled ? "scrolled" : ""} font-montserrat`}
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
        <Link
          to="/login"
          className="text-white hover:text-coral-red transition duration-300"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Nav;