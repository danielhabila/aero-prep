const StatCard = ({ title, value }) => {
  return (
    <div className="p-4 rounded-md bg-blue-800 text-white text-center text-2xl">
      <h3 className="uppercase text-base">{title}</h3>
      <span>{value}</span>
    </div>
  );
};

export default StatCard;
