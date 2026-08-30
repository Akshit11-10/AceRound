// Converts plain resume text (with our AI's convention of ALL CAPS section
// headers and "- " bullet points) into a real, downloadable .docx file
// using the "docx" npm package. This can't reproduce the user's original
// visual template (that information is lost the moment we extract plain
// text from their PDF), but it produces a clean, properly structured,
// editable Word document instead of a flat .txt file.

const { Document, Packer, Paragraph, HeadingLevel, TextRun } = require("docx");

function isLikelyHeading(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.length > 40) return false;
  if (!/[A-Za-z]/.test(trimmed)) return false;
  return trimmed === trimmed.toUpperCase();
}

function buildParagraphs(resumeText) {
  const lines = resumeText.split("\n");
  const paragraphs = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    if (isLikelyHeading(trimmed)) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [new TextRun({ text: trimmed, bold: true })],
        })
      );
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: trimmed.replace(/^[-•]\s*/, "") })],
        })
      );
      continue;
    }

    paragraphs.push(new Paragraph({ children: [new TextRun({ text: trimmed })], spacing: { after: 80 } }));
  }

  return paragraphs;
}

async function generateResumeDocxBuffer(resumeText) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: buildParagraphs(resumeText),
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { generateResumeDocxBuffer };
