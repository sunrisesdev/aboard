import type { components } from "./schema";

export type TraewellingUser = Omit<
  components["schemas"]["UserAuthResource"],
  "id"
> & {
  id: string;
};
