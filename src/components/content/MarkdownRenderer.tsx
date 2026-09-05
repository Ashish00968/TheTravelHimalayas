import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline bold formatting (**text**) into <strong> elements.
 */
function renderFormattedText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-foreground">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Lightweight, zero-dependency Markdown renderer that transforms guide markdown
 * (## Headings, - Unordered lists with bold labels, and paragraphs) into
 * semantically rich, crawlable HTML.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-3 my-5 pl-1">
          {currentListItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-foreground/85 leading-relaxed font-light text-base sm:text-lg"
            >
              <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>{renderFormattedText(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const pText = currentParagraphLines.join(" ").trim();
      if (pText) {
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="text-foreground/85 leading-relaxed font-light text-base sm:text-lg my-4"
          >
            {renderFormattedText(pText)}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      const headingText = line.replace(/^##\s+/, "");
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-2xl sm:text-3xl font-display font-semibold text-foreground mt-12 mb-4 tracking-tight border-b border-foreground/[0.08] pb-3"
        >
          {headingText}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      const headingText = line.replace(/^###\s+/, "");
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-xl sm:text-2xl font-display font-medium text-foreground mt-8 mb-3 tracking-tight"
        >
          {headingText}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      const itemText = line.replace(/^[-*]\s+/, "");
      currentListItems.push(itemText);
    } else {
      flushList();
      currentParagraphLines.push(line);
    }
  }

  flushParagraph();
  flushList();

  return <div className={`space-y-2 ${className}`}>{elements}</div>;
}
