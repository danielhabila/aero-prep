export default {
  name: "questions",
  title: "Questions",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
    },
    {
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "correctAnswer",
      title: "Correct Answer",
      type: "string",
    },
    {
      name: "explanation",
      title: "Explanation",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
    },
  ],
};
