import React, { memo } from "react";
import { AiOutlineHome, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { FiUser, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const MobileNav = ({ showNav, setShowNav }) => {
  return (
    <div
      className={
        showNav
          ? "fixed bg-[#151a1e] w-full top-[52px] left-0 border-b-2 border-white z-50 overflow-hidden"
          : "hidden"
      }
    >
      <div className="block items-center justify-center text-white">
        <ul className="flex gap-8 flex-col mt-10 text-white">
          {[
            { to: "/", icon: <AiOutlineHome fontSize={20} />, label: "Home" },
            { to: "/about", icon: <FiUser fontSize={20} />, label: "About" },
            {
              to: "/projects",
              icon: <AiOutlineFundProjectionScreen fontSize={20} />,
              label: "Projects",
            },
            { to: "/resume", icon: <FiFileText fontSize={20} />, label: "Resume" },
          ].map(({ to, icon, label }) => (
            <li key={to} className="relative group text-white">
              <Link
                to={to}
                className="flex gap-1 items-center justify-center cursor-pointer text-base font-bold text-white"
                style={{ textDecoration: "none" }}
                onClick={() => setShowNav(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(MobileNav);
