export default {
  name: "inratMello",
  title: "Inrat Mello",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "array",
      of: [{ type: "block" }],
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
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      options: {
        accept: ".pdf",
      },
    },
  ],
};
