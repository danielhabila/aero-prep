export default function StatItem(props) {
  return (
    <>
      <article className="bg-[#191f24] rounded-md border border-gray-700 p-5 ">
        <div className="flex flex-start space-x-4">
          <div className="grow">
            <h2 className="font-semibold text-white mb-2">
              <h1>{props.examType ? props.examType : "No exam type"}</h1>
            </h2>
            <footer className="flex flex-wrap text-sm">
              <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                <span className="text-gray-300 text-[0.8rem]">
                  {props.startTime
                    ? new Date(props.startTime).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No start time"}
                </span>
              </div>
              <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                <span className="text-gray-300 text-xs">
                  {props.startTime
                    ? new Date(props.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "No start time"}{" "}
                  Local
                </span>
              </div>
              <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                <span className="text-gray-300 text-xs">
                  {props.numberOfQuestions
                    ? `${props.numberOfQuestions} Qs`
                    : "No number of questions"}
                </span>
              </div>
            </footer>
          </div>
          <h1
            title="Percentage"
            className="flex items-center text-xl font-bold"
          >
            {props.scorePercentage
              ? `${props.scorePercentage}%`
              : "No score percentage"}
          </h1>
        </div>
      </article>
    </>
  );
}
