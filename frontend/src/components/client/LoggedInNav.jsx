import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hamburger } from "../../assets/icons";
import { headerLogo } from "../../assets/images";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';

const LoggedInNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || [] // Retrieve notifications from local storage
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firebaseUID");
    console.log("User logged out and tokens cleared.");
    window.dispatchEvent(new Event('loginStateChange'));
    setIsLoggedIn(false);
    navigate("/login");
  };

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
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

  const handleNewNotification = (notification) => {
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // Save notifications to local storage
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

  // Mock function to simulate receiving a new notification
  useEffect(() => {
    const mockNotification = {
      id: Date.now(),
      title: "Order Status Updated",
      message: "Your order #12345 has been shipped.",
      timestamp: new Date().toLocaleString(),
    };
    setTimeout(() => handleNewNotification(mockNotification), 10000); // Simulate a notification after 10 seconds
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
              to="/shopping"
              className="hover:text-coral-red transition duration-300"
            >
              Products
            </Link>
          </li>
        </ul>
        <div className="flex space-x-4 items-center relative">
          {isLoggedIn && (
            <>
              <button
                className="text-white hover:text-coral-red transition duration-300 relative"
                onClick={() => setIsModalOpen(true)}
              >
                <FontAwesomeIcon icon={faBell} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>

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

      {/* Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <ul className="max-h-64 overflow-y-auto">
  {notifications.length > 0 ? (
    notifications.map((notification) => (
      <li key={notification.id} className="mb-2">
        <div className="flex justify-between items-center">
          <div>
            <strong>{notification.title}</strong>
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
          </div>
          <button
            className="text-red-500 text-sm"
            onClick={() => removeNotification(notification.id)}
          >
            X
          </button>
        </div>
      </li>
    ))
  ) : (
    <li className="text-center text-gray-500">No notifications.</li>
  )}
</ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-coral-red text-white rounded hover:bg-coral-red-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LoggedInNav;
