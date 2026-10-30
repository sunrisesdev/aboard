import type { StatusResource } from '@/lib/traewelling';

type BodyPart = { text: string; username?: string };

// Mention positions and lengths count UTF-8 bytes (Träwelling uses PHP's preg_match_all), so the body is
// sliced as bytes. Each mention starts at an "@", so the slices never split a character.
export function getBodyParts(body: string, mentions: StatusResource['bodyMentions']) {
  const bytes = new TextEncoder().encode(body);
  const decoder = new TextDecoder();
  const parts: BodyPart[] = [];
  let offset = 0;

  for (const { length, position, user } of mentions.toSorted((a, b) => a.position - b.position)) {
    if (position < offset) continue;

    parts.push({ text: decoder.decode(bytes.subarray(offset, position)) });
    parts.push({
      text: decoder.decode(bytes.subarray(position, position + length)),
      username: typeof user?.username === 'string' ? user.username : undefined,
    });
    offset = position + length;
  }

  parts.push({ text: decoder.decode(bytes.subarray(offset)) });

  return parts.filter(({ text }) => text);
}

// Splits the parts at empty lines, single line breaks stay in the text. Mentions never contain a line break.
export function getBodyParagraphs(body: string, mentions: StatusResource['bodyMentions']) {
  let paragraph: BodyPart[] = [];
  const paragraphs = [paragraph];

  for (const part of getBodyParts(body, mentions)) {
    if (part.username) {
      paragraph.push(part);
      continue;
    }

    part.text.split(/\r?\n\s*\n/).forEach((text, index) => {
      if (index > 0) {
        paragraph = [];
        paragraphs.push(paragraph);
      }
      if (text) paragraph.push({ text });
    });
  }

  return paragraphs.filter((parts) => parts.some(({ text }) => text.trim()));
}
