/**
 * Cross-reference utilities for parsing citations from markdown
 * Mirrors the logic from @extenote/core/crossref.ts
 */

export type LinkType = "wikilink" | "citation";

export interface ObjectLink {
  targetId: string;
  displayText?: string;
  context?: string;
  linkType: LinkType;
}

/**
 * Regular expression to find citation brackets like [@key] or [@key1; @key2]
 */
const CITATION_BRACKET_REGEX = /\[([^\]]*@[^\]]+)\]/g;

/**
 * Regular expression to extract individual citation keys from within brackets
 */
const CITATION_KEY_REGEX = /@([\w][\w:._-]*)/g;

/**
 * Parse Pandoc/Quarto style citations from text content
 * Matches patterns like [@smith2024] or [@smith2024; @jones2023]
 */
export function parseCitations(text: string): ObjectLink[] {
  const links: ObjectLink[] = [];
  const seenKeys = new Set<string>();

  for (const bracketMatch of text.matchAll(CITATION_BRACKET_REGEX)) {
    const bracketContent = bracketMatch[1];
    const matchEnd = bracketMatch.index! + bracketMatch[0].length;

    // Skip email addresses
    if (bracketContent.toLowerCase().includes("mailto:")) {
      continue;
    }

    // Skip markdown links - if bracket is immediately followed by (
    if (text[matchEnd] === "(") {
      continue;
    }

    // Get context for this citation bracket
    const start = Math.max(0, bracketMatch.index! - 30);
    const end = Math.min(text.length, matchEnd + 30);
    const context = text.slice(start, end).replace(/\n/g, ' ').trim();
    const contextStr = start > 0 ? `...${context}...` : `${context}...`;

    // Extract all @keys from within the brackets
    for (const keyMatch of bracketContent.matchAll(CITATION_KEY_REGEX)) {
      const citationKey = keyMatch[1];

      if (!seenKeys.has(citationKey)) {
        seenKeys.add(citationKey);
        links.push({
          targetId: citationKey,
          context: contextStr,
          linkType: "citation",
        });
      }
    }
  }

  return links;
}

/**
 * Regular expression to match [[object-id]] or [[object-id|display text]] links
 */
const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Parse wiki-style links from text content
 */
export function parseWikiLinks(text: string): ObjectLink[] {
  const links: ObjectLink[] = [];
  const matches = text.matchAll(WIKI_LINK_REGEX);

  for (const match of matches) {
    const targetId = match[1].trim();
    const displayText = match[2]?.trim();

    const start = Math.max(0, match.index! - 30);
    const end = Math.min(text.length, match.index! + match[0].length + 30);
    const context = text.slice(start, end).replace(/\n/g, ' ').trim();

    links.push({
      targetId,
      displayText,
      context: start > 0 ? `...${context}...` : `${context}...`,
      linkType: "wikilink",
    });
  }

  return links;
}

/**
 * Parse all links (both wikilinks and citations) from text
 */
export function parseAllLinks(text: string): ObjectLink[] {
  return [...parseWikiLinks(text), ...parseCitations(text)];
}
