import React, { forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { FaTimes } from "react-icons/fa";

type ModalSize = "small" | "medium" | "large" | "extra-large" | "full";

interface ModalParentProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  role?: string | null;
  size?: ModalSize;
  noPadding?: boolean;
}

const getModalSizeClasses = (size: ModalSize = "medium"): string => {
  const sizeClasses = {
    small: "sm:max-w-xs lg:max-w-sm",
    medium: "sm:max-w-sm lg:max-w-md",
    large: "sm:max-w-md lg:max-w-lg",
    full: "sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md",
    "extra-large":
      "sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw] w-full h-fit-content",
  };
  return sizeClasses[size];
};

// Wrap component with forwardRef
export const ModalParent = forwardRef<HTMLDivElement, ModalParentProps>(
  ({ children, onClose, isOpen, size = "medium", noPadding = false }, ref) => {
    useEffect(() => {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose?.();
        }
      };
      document.addEventListener("keydown", handleKeydown);
      return () => {
        document.removeEventListener("keydown", handleKeydown);
      };
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 overflow-hidden m-0 w-full"
        ref={ref}
        onClick={(e) => {
          // Only close if clicking directly on the backdrop (not on modal content)
          if (e.target === e.currentTarget) {
            onClose?.();
          }
        }}
      >
        <div
          className={`bg-white rounded-lg shadow-sm ${noPadding ? "" : "p-0"} w-full max-h-full overflow-hidden ${getModalSizeClasses(size)} relative ${
            size === "extra-large" ? "my-4" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`flex justify-end items-center absolute ${
              noPadding ? "top-8 right-8 z-[9999]" : "top-4 right-4 z-10"
            }`}
          >
            <Button
              onClick={onClose}
              variant="text"
              size="small"
              className={`absolute z-10 outline-none border-none rounded-full hover:bg-gray-100 p-2 ${
                size === "extra-large" ? "top-6 right-6" : "top-4 right-4"
              }`}
            >
              <FaTimes
                className="text-gray-500 hover:text-red-500 transition"
                size={20}
              />
            </Button>
          </div>
          <div className={`${noPadding ? "" : "p-2"}`}>{children}</div>
        </div>
      </div>,
      document.body
    );
  },
);
