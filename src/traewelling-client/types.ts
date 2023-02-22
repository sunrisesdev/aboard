export type TraewellingStation = {
  ibnr: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  rilIdentifer: string | null;
};

export type TraewellingUser = {
  displayName: string;
  home: TraewellingStation | null;
  id: number;
  language: string | null;
  mastodonUrl: string | null;
  points: number;
  preventIndex: boolean;
  privacyHideDays: number | null;
  privateProfile: boolean;
  profilePicture: string;
  role: number; // TODO: Type
  trainDistance: number;
  trainDuration: number;
  trainSpeed: number;
  twitterUrl: string | null;
  username: string;
};
