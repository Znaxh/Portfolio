import React, { useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const Github = () => {

  var isSmallScreen = true;
  return (
    <div className="flex flex-col font-raleway items-center justify-center pb-40 pt-12">
      <div className={`text-white mb-4 text-3xl`}>
        Days I <span className="text-[#F2613F]">Code</span>
      </div>
      <div className={`text-white md:${isSmallScreen = false}`}>
        <GitHubCalendar
          username="anuragsingh4845"
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
