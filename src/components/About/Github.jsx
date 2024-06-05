import GitHubCalendar from "react-github-calendar";

const Github = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-40 pt-20">
      <div className="text-3xl mb-4">
        Days I <span className="text-gray-900">Code</span>
      </div>
      <div>
        <GitHubCalendar
          username="anuragsingh4845"
          blockSize={15}
          blockMargin={5}
          color="#c084f5"
          fontSize={16}
        />
      </div>
    </div>
  );
};

export default Github;