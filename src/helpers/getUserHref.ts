export function getUserHref(username: string) {
  return `/@${encodeURIComponent(username)}`;
}
