import StatList from "@/components/StatList";

const page = async () => {
  return (
    <div className="py-20">
      <div className="text-center mb-10 text-2xl uppercase font-bold">
        <h1>My Stats 📊</h1>
      </div>
      <div className=" ">
        <StatList />
      </div>
    </div>
  );
};

export default page;
