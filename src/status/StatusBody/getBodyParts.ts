import type { StatusResource } from '@/lib/traewelling';

// Mention positions and lengths count UTF-8 bytes (Träwelling uses PHP's preg_match_all), so the body is
// sliced as bytes. Each mention starts at an "@", so the slices never split a character.
export function getBodyParts(body: string, mentions: StatusResource['bodyMentions']) {
  const bytes = new TextEncoder().encode(body);
  const decoder = new TextDecoder();
  const parts: { text: string; username?: string }[] = [];
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
