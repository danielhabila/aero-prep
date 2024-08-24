import StatCard from "@/components/StatCard";

const page = async () => {
  return (
    <div className="py-20">
      <div className="text-center mb-10 text-2xl uppercase">
        <h1>My Stats 📊</h1>
      </div>
      {/* <div className="max-w-[1500px] mx-auto w-[90%] grid sm:grid-cols-3 gap-10 justify-center">
        <StatCard
          title="Total Points"
          value={
            currentUser?.data?.quizResults[0].quizScore
          }
        />
        <StatCard
          title="Correct Answers"
          value={
            currentUser?.data?.quizResults[0].correctAnswers
          }
        />
        <StatCard
          title="Wrong Answers"
          value={
            currentUser?.data?.quizResults[0].wrongAnswers
          }
        />
      </div> */}
    </div>
  );
};

export default page;
