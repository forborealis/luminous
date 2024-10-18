import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { navLinks } from "../../constants";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const navigate = useNavigate();

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    navigate("/"); // Navigate to home page after sign out
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
          <div className="flex space-x-4 items-center">
            <button
              className="text-coral-red-500 hover:underline"
              onClick={handleSignOut}
            >
              Sign out
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
          <Link to="/login" className="text-white">
            <img src={hamburger} alt="hamburger icon" className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;