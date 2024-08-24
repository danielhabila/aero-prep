import Loader from "@/components/Loader";
import Quiz from "@/components/Quiz";
import { client } from "@/sanity/lib/client";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";

export const dynamic = "force-dynamic";

async function getData() {
  const query = `*[_type == "airlaw"]{
    question,
    answers,
    correctAnswer
  }`;

  const data = await client.fetch(query);
  return data;
}

const page = withPageAuthRequired(
  async () => {
    const questions = await getData();
    const { user } = await getSession();

    if (user) {
      try {
        // console.log("user from quiz page", user);
        const response = await axios.post("/api/checkUser", {
          username: user.nickname,
          email: user.email,
        });

        if (response.status === 200) {
          console.log("Welcome back");
        } else if (response.status === 201) {
          console.log("Welcome new user");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error checking user:", error.message);
      }
    }

    return (
      <>
        {user ? <Quiz questions={questions} email={user.email} /> : <Loader />}
      </>
    );
  },
  { returnTo: "/quiz" }
);

export default page;
