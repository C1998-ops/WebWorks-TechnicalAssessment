import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/favicon.svg";
import { HiMenu, HiX } from "react-icons/hi";
import { useUserInfo } from "@/hooks/useUserInfo";
import { clearAuthSession } from "@/utils/authState";
import { ROLE_NAV_ITEMS } from "@/config/nav-items";

interface NavItem {
  label: string;
  path: string;
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserInfo();
  const location = useLocation();
  const navItems: NavItem[] = [
    { label: "Leads", path: "/dashboard" },
    { label: "Creator", path: "/Creators" },
    // { label: "About", path: "/about" },
  ];
  const userRole = user?.role || "agent";
  const allowedPaths =
    ROLE_NAV_ITEMS[userRole as keyof typeof ROLE_NAV_ITEMS] ||
    ROLE_NAV_ITEMS.agent;
  const filteredNavItems = navItems.filter((item) =>
    allowedPaths.includes(item.path),
  );
  console.log(filteredNavItems);
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
            {filteredNavItems.map((item) => {
              const isActive = location.pathname == item?.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-primary-navy px-3 py-2 rounded-md lg:text-xs xl:text-body-bold transition-colors ${
                    isActive
                      ? "bg-[#00276B] text-primary-navy border border-[#6374EA] shadow-[0_0_12px_0_rgba(99,116,234,0.35)]"
                      : "text-medium hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    {item.label}
                  </div>
                </Link>
              );
            })}
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
        className={`lg:hidden fixed inset-0 z-50 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
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
              {navItems.map((item) => {
                const isActive = location.pathname == item?.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-primary-navy px-3 py-2 transition-colors ${
                      isActive
                        ? "bg-[#00276B] text-primary-navy border-[#6374EA] shadow-inner]"
                        : "text-medium hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                      {item.label}
                    </div>
                  </Link>
                );
              })}
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
