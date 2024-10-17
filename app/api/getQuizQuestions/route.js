import { client } from "@/sanity/lib/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const count = parseInt(searchParams.get("count") || "25");

  if (type === "full") {
    const categories = [
      "pplAirlawPtca",
      "pplNavPtca",
      "pplGenPtca",
      "pplMetPtca",
    ];
    let allQuestions = [];

    for (const category of categories) {
      const query = `*[_type == "${category}"] {
        question,
        answers,
        correctAnswer,
        explanation,
        image
      }`;

      const data = await client.fetch(query);
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 25);
      allQuestions = [...allQuestions, ...selected];
    }

    const shuffledAll = allQuestions.sort(() => 0.5 - Math.random());

    return new Response(JSON.stringify(shuffledAll), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const query = `*[_type == "${type}"] {
      question,
      answers,
      correctAnswer,
      explanation,
      image
    }`;

    try {
      const data = await client.fetch(query);
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      return new Response(JSON.stringify(selected), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
