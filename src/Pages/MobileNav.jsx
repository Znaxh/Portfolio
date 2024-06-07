import React from "react";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiFillStar,
} from "react-icons/ai";
import { FiUser, FiFileText } from "react-icons/fi";
import { DiGitBranch } from "react-icons/di";
import { Link } from "react-router-dom";

function MobileNav({ showNav, setShowNav }) {
  return (
    <div
      className={
        showNav
          ? "fixed max-h-screen bg-gradient-to-r from-purple-900 to-violet-900 w-full top-[52px] left-0 rounded-b-md border-2 border-t-0 border-purple-700 z-50 transition-all duration-500 overflow-hidden"
          : "fixed max-h-0 bg-gradient-to-r from-purple-900 to-violet-900 w-full top-[52px] left-0 rounded-b-md z-50 transition-all duration-500 overflow-hidden"
      }
      style={{ transition: "max-height 0.5s ease" }}
    >
      <div className="block items-center justify-center text-white">
        <ul className="flex gap-8 flex-col mt-10 ">
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
            <li key={to} className="relative group">
              <Link
                to={to}
                className="flex gap-1 items-center justify-center cursor-pointer text-base font-bold"
                style={{ textDecoration: "none" }}
                onClick={() => setShowNav(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/riteshk-007/portfolio"
          target="_blank"
          rel="noreferrer"
          className="flex w-24 my-5 mx-auto gap-2 justify-center items-center text-lg bg-fuchsia-900 px-3 py-[3px] border border-purple-700 rounded-sm"
        >
          <DiGitBranch fontSize={18} />
          <AiFillStar fontSize={18} />
        </a>
      </div>
    </div>
  );
}

export default MobileNav;
