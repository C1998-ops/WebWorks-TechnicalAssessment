import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/favicon.svg";
import { HiMenu, HiX } from "react-icons/hi";
import { useUserInfo } from "@/hooks/useUserInfo";
import { clearAuthSession } from "@/utils/authState";

interface NavItem {
  label: string;
  path: string;
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserInfo();
  const navItems: NavItem[] = [
    { label: "Leads", path: "/leads" },
    { label: "About", path: "/about" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto lg:h-5 xl:h-8"
                src={logo}
                alt="vite Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 lg:space-x-1 xl:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-primary-navy px-3 py-2 rounded-md t lg:text-xs xl:text-body-bold transition-colors"
              >
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  {item.label}
                  {/* <BiCaretDown className="w-4 h-4" /> */}
                </div>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4 lg:space-x-1 xl:space-x-4 whitespace-nowrap">
            {user ? (
              <div className="inline-block w-full">
                <Link
                  to="/logout"
                  className="text-primary-orange px-3 py-2 rounded-md text-body-bold lg:text-xs xl:text-body-bold hover:underline"
                >
                  Log Out
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-primary-orange hover:bg-primary-orange/90 text-primary-navy px-4 py-2 rounded-md text-sm lg:text-xs xl:text-body-bold font-medium transition-colors"
                >
                  Join our Network
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-orange"
          >
            {isMobileMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          onClick={toggleMobileMenu}
        />

        {/* Menu Content */}
        <div className="fixed inset-y-0 left-0 w-full bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <img className="h-8 w-auto" src={logo} alt="Sandwych Logo" />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-primary-navy px-3 py-2 rounded-md text-body-bold hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center justify-between whitespace-nowrap">
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t space-y-2 text-center">
              <Link
                to="/login"
                className="block text-primary-orange px-3 py-2 rounded-md text-body-bold hover:bg-gray-50"
                onClick={() => {
                  clearAuthSession();
                }}
              >
                {isAuthenticated ? "Log Out" : "Log in"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary-burgundy h-3" />
    </div>
  );
};

export default Header;
