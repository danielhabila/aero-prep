import StatList from "@/components/StatList";

const page = async () => {
  return (
    <div className="py-8">
      <div className="text-center mb-2 text-2xl  font-bold">
        <h1>Last 10 Results 📊</h1>
      </div>
      <div className=" ">
        <StatList />
      </div>
    </div>
  );
};

export default page;
