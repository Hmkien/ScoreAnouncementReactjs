import "../../Style/footer.css";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Đại học Mỏ- Địa Chất. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
