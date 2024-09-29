import Loader from "@/components/Loader";
import QuizComponent from "@/components/QuizComponent";
import { client } from "@/sanity/lib/client";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";

export const dynamic = "force-dynamic";

async function getData(type, count = 50) {
  const query = `*[_type == "${type}"] {
    question,
    answers,
    correctAnswer,
    explanation
  }`;

  const data = await client.fetch(query, { type });
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const page = withPageAuthRequired(
  async ({ params }) => {
    const count = 50;
    const type = params.type === "pstar" ? "pstar" : "airlaw";
    const questions = await getData(type, count);
    const { user } = await getSession();

    if (user) {
      try {
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
        {user ? (
          <QuizComponent
            questions={questions}
            email={user.email}
            quizType={type}
          />
        ) : (
          <Loader />
        )}
      </>
    );
  },
  { returnTo: "/quiz" }
);

export default page;
