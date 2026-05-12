import { client } from "@/sanity/lib/client";
import { prisma } from "@/lib/prisma";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PROJECTION = `{
  _id,
  question,
  answers,
  correctAnswer,
  explanation,
  image
}`;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const count = parseInt(searchParams.get("count") || "25");
  const email = searchParams.get("email");

  if (type === "full") {
    const categories = [
      "pplAirlawPtca",
      "pplNavPtca",
      "pplGenPtca",
      "pplMetPtca",
    ];
    let allQuestions = [];

    for (const category of categories) {
      const data = await client.fetch(
        `*[_type == "${category}"] ${PROJECTION}`
      );
      allQuestions = [...allQuestions, ...shuffle(data).slice(0, 25)];
    }

    return Response.json(shuffle(allQuestions));
  }

  try {
    const all = await client.fetch(`*[_type == "${type}"] ${PROJECTION}`);

    if (type === "ncaaAirlaw" && email) {
      const selected = await pickWithWrongMix({ all, count, email, type });
      return Response.json(selected);
    }

    return Response.json(shuffle(all).slice(0, count));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function pickWithWrongMix({ all, count, email, type }) {
  const wrongTarget = Math.floor(count * 0.2);
  const freshTarget = count - wrongTarget;

  const wrongHistory = await prisma.questionHistory.findMany({
    where: { email, quizType: type, wasCorrect: false },
    select: { questionId: true },
  });
  const wrongIds = new Set(wrongHistory.map((h) => h.questionId));

  const seenHistory = await prisma.questionHistory.findMany({
    where: { email, quizType: type, wasCorrect: true },
    select: { questionId: true },
  });
  const correctIds = new Set(seenHistory.map((h) => h.questionId));

  const wrongPool = all.filter((q) => wrongIds.has(q._id));
  const neverSeen = all.filter(
    (q) => !wrongIds.has(q._id) && !correctIds.has(q._id)
  );
  const previouslyCorrect = all.filter((q) => correctIds.has(q._id));

  const wrongPicked = shuffle(wrongPool).slice(0, wrongTarget);

  const freshShortfall = freshTarget;
  const freshFromNew = shuffle(neverSeen).slice(0, freshShortfall);
  const stillNeed = freshShortfall - freshFromNew.length;
  const freshFromCorrect =
    stillNeed > 0 ? shuffle(previouslyCorrect).slice(0, stillNeed) : [];
  const freshPicked = [...freshFromNew, ...freshFromCorrect];

  let combined = [...wrongPicked, ...freshPicked];

  if (combined.length < count) {
    const chosenIds = new Set(combined.map((q) => q._id));
    const remainder = all.filter((q) => !chosenIds.has(q._id));
    combined = [...combined, ...shuffle(remainder).slice(0, count - combined.length)];
  }

  return shuffle(combined);
}
