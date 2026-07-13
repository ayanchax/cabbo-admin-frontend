import React from "react";
import { APP } from "@/utils";

const Footer = ({ children, className = "" }) => {
  return (
    <footer className={`w-full text-center text-sm text-gray-500 ${className}`}>
      {children ?? (
        <>
          {APP.name} Technologies Pvt. Ltd. &copy; {new Date().getFullYear()}
        </>
      )}
    </footer>
  );
};

export { Footer };
