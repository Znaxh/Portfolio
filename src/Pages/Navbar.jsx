import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiFillStar,
} from "react-icons/ai";
import { FiUser, FiFileText } from "react-icons/fi";
import { DiGitBranch } from "react-icons/di";
import { RiMenu3Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import MobileNav from "./MobileNav";

function Navbar() {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  const name = ["{ Ritesh }"];

  return (
    <div className="flex items-center justify-between px-4 z-50 relative lg:sticky top-0 bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg shadow-lg">
      <span className="capitalize md:w-1/3 lg:w-1/2 flex items-center justify-center py-2 px-2">
        <h1
          className="cursor-pointer text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-50 to-blue-100 bg-clip-text text-transparent uppercase"
          onClick={() => navigate("/")}
        >
          {name}
        </h1>
      </span>
      <div className="w-2/3 hidden lg:flex items-center justify-start">
        <ul className="flex gap-8 lg:gap-12">
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
                style={{ textDecoration: "none" }}
                className="flex gap-1 items-center justify-center cursor-pointer text-base lg:text-lg font-semibold text-white relative before:absolute before:left-0 before:-bottom-1 before:w-0 before:transition-all before:duration-200 before:h-[4px] before:bg-white group-hover:before:w-full"
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
          className="flex mx-10 gap-2 text-lg bg-purple-900 px-5 py-[5px] border border-purple-700 rounded-sm hover:bg-purple-800 transition-all duration-200 hover:-translate-y-[2px]"
        >
          <DiGitBranch fontSize={20} />
          <AiFillStar fontSize={20} />
        </a>
      </div>
      <span>
        <div className="h-full lg:hidden flex items-center justify-center cursor-pointer">
          {showNav ? (
            <MdClose
              fontSize={25}
              className="text-white"
              onClick={() => setShowNav(!showNav)}
            />
          ) : (
            <RiMenu3Fill
              fontSize={25}
              className="text-white"
              onClick={() => setShowNav(!showNav)}
            />
          )}
          <MobileNav showNav={showNav} setShowNav={setShowNav} />
        </div>
      </span>
    </div>
  );
}

export default Navbar;
