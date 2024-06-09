import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const Github = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 912);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col font-raleway items-center justify-center pb-40 pt-12">
      <div className="text-white font-semibold mb-4 text-3xl">
        Days I <span className="text-indigo-200">Code</span>
      </div>
      <div className="text-white">
        <GitHubCalendar
          username="Znaxh"
          blockSize={isSmallScreen ? 6 : 15}
          blockMargin={isSmallScreen ? 1 : 5}
          fontSize={isSmallScreen ? 12 : 16}
          colorScheme="dark"
        />
      </div>
    </div>
  );
};

export default Github;
