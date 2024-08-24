import Hero from "@/components/Hero";
import { getSession } from "@auth0/nextjs-auth0";

const Home = () => {
  const { user } = getSession();
  // console.log("user", user);
  return (
    <>
      <Hero />
      <div>{user?.name}</div>
    </>
  );
};

export default Home;
