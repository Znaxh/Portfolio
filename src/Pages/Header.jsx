import { AiFillStar } from "react-icons/ai";
import { CgGitBranch, CgGitFork } from "react-icons/cg";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky z-50 top-0">
      <nav className=" border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex space-x-9 justify-center ">
          <div className="px-4 py-2 rounded-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700 " : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Home
            </NavLink>
          </div>
          <div className="px-4 py-2 rounded-md ">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              About
            </NavLink>
          </div>
          <div className="px-4 py-2 rounded-md ">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Projects
            </NavLink>
          </div>
          <div className="px-4 py-2 rounded-md ">
            <NavLink
              to="/resume"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Resume
            </NavLink>
          </div>
          <button
            className="flex space-x-2 bg-gray-500 place-content-evenly px-4 py-2 text-xl rounded-md border-2 border-white hover:bg-white hover:border-black"
            type="button"
            onClick={() => {
              window.open("https://github.com/AnuragSingh4845/port", "_blank");
            }}
          >
            <CgGitFork />
            <AiFillStar />
          </button>
        </div>
      </nav>
    </header>
  );
}
