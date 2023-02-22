import levenshtein from 'js-levenshtein';

export const sortByLevenshtein = <T>(
  elements: T[],
  selector: (element: T) => string,
  pattern: string
) => {
  return [...elements].sort((a, b) => {
    return (
      levenshtein(selector(a), pattern) - levenshtein(selector(b), pattern)
    );
  });
};
