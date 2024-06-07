import React, { useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const Github = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .react-activity-calendar__day {
        fill: gray !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center pb-40 pt-20">
      <div className="text-3xl text-white mb-4">
        Days I <span className="text-[#F2613F]">Code</span>
      </div>
      <div className="text-white"> 
        <GitHubCalendar
          username="anuragsingh4845"
          blockSize={15}
          blockMargin={5}
          fontSize={16}
          colorScheme="dark"
        />
      </div>
    </div>
  );
};

export default Github;
