import Loader from "@/components/Loader";
import Quiz from "@/components/Quiz";
import { client } from "@/sanity/lib/client";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

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

    return (
      <>
        <Quiz questions={questions} email={user.email} />
      </>
    );
  },
  { returnTo: "/quiz" }
);

export default page;
