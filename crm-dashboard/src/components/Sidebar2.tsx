import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "./Button";
import { clearAuthSession } from "../utils/authState";
import { useUserInfo } from "@/hooks/useUserInfo";
import { initials } from "@/utils/transformer";
import { ROLE_NAV_ITEMS } from "@/config/nav-items";

interface NavItem {
  label: string;
  path: string;
  badge?: number;
  hasDropdown?: boolean;
  tooltip?: string;
}

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleCollapse: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Leads", path: "/leads" },
  { label: "Creators", path: "/Creators" },
];

const SidebarFreeUser: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  isMobile,
  isTablet,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useUserInfo();
  const userRole = user?.role || "agent";
  const allowedPaths =
    ROLE_NAV_ITEMS[userRole as keyof typeof ROLE_NAV_ITEMS] ||
    ROLE_NAV_ITEMS.agent;
  const filteredNavItems = NAV_ITEMS.filter((item) =>
    allowedPaths.includes(item.path),
  );
  // Close on outside click (mobile/tablet)
  useEffect(() => {
    if ((!isMobile && !isTablet) || !isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isTablet, isOpen, onClose]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  // Sidebar is "expanded" when open and not collapsed (desktop), or open on mobile/tablet
  const expanded = isMobile || isTablet ? isOpen : isOpen && !isCollapsed;

  // Sidebar translate / width
  const sidebarClasses = [
    "fixed left-0 top-0 h-screen bg-primary-navy shadow-lg z-40 flex flex-col transition-all duration-300",
    isMobile || isTablet
      ? isOpen
        ? "w-60 translate-x-0"
        : "w-60 -translate-x-full"
      : isCollapsed
        ? "w-16"
        : "w-[220px]",
  ].join(" ");

  return (
    <div
      ref={sidebarRef}
      className={sidebarClasses}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10 min-h-[56px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6374EA] to-[#4a5bbf] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          CRM
        </div>
        {expanded && (
          <span className="text-white text-sm font-semibold tracking-wide truncate">
            Manage Operations
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 sidebar-scrollbar">
        <ul className="flex flex-col gap-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const tooltipLabel = item.tooltip || item.label;

            return (
              <li key={item.path} className="relative w-full">
                <Link
                  to={item.path}
                  onClick={() => (isMobile || isTablet) && onClose()}
                  className={[
                    "flex items-center gap-2.5 py-2.5 rounded-full transition-all duration-200 text-sm",
                    expanded ? "px-4" : "px-2 justify-center",
                    isActive
                      ? "bg-[#00276B] text-white border border-[#6374EA] shadow-[0_0_12px_0_rgba(99,116,234,0.35)]"
                      : "text-white/60 hover:bg-white/10 hover:text-white border border-transparent",
                  ].join(" ")}
                  onMouseEnter={(e) => {
                    if (!isActive && !expanded) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.right + 8,
                        y: rect.top + rect.height / 2,
                      });
                      setHoveredItem(tooltipLabel);
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Icon placeholder — swap with actual icons per item */}
                  <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-base">
                    {item.label === "Dashboard" && "⊞"}
                    {item.label === "Leads" && "👥"}
                    {item.label === "Creators" && "🏢"}
                  </span>

                  {expanded && (
                    <>
                      <span
                        className={`truncate ${isActive ? "font-medium" : "font-normal"}`}
                      >
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <span className="ml-auto bg-[#6374EA]/30 text-[#a5b4fc] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.hasDropdown && (
                        <FaChevronDown className="ml-auto w-3 h-3 opacity-60" />
                      )}
                    </>
                  )}
                </Link>

                {/* Tooltip for collapsed mode */}
                {!expanded &&
                  !isMobile &&
                  !isTablet &&
                  hoveredItem === tooltipLabel &&
                  tooltipPosition && (
                    <div
                      className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg pointer-events-none whitespace-nowrap"
                      style={{
                        top: tooltipPosition.y,
                        left: tooltipPosition.x,
                        transform: "translateY(-50%)",
                      }}
                      role="tooltip"
                    >
                      {hoveredItem}
                    </div>
                  )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0 border-t border-white/10 px-2 py-3 flex flex-col gap-2">
        {/* Collapse toggle (desktop only) */}
        {!isMobile && !isTablet && (
          <button
            className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all text-xs"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <IoIosArrowForward className="w-4 h-4 text-secondary-gold" />
            ) : (
              <>
                <IoIosArrowBack className="w-4 h-4 text-secondary-gold" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}

        {/* User row */}
        {expanded ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-gold to-yellow-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials(user?.name || "n/a")}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">
                {user?.name}
              </div>
              <div className="text-white/40 text-[11px] truncate">
                {user?.role}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-gold to-yellow-700 flex items-center justify-center text-white text-xs font-semibold">
              {initials(user?.name || "n/a")}
            </div>
          </div>
        )}

        {/* Logout */}
        {expanded ? (
          <Button
            variant="secondary"
            size="small"
            className="w-full rounded-md bg-transparent hover:bg-white/10 text-secondary-gold border-secondary-gold/30 text-xs py-1.5 flex items-center justify-center gap-1.5"
            onClick={handleLogout}
          >
            <TbLogout2 className="w-4 h-4" />
            Log out
          </Button>
        ) : (
          <button
            className="w-full flex justify-center py-2 cursor-pointer hover:bg-white/10 rounded-lg transition-all"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            <TbLogout2 className="w-5 h-5 text-secondary-gold" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarFreeUser;
