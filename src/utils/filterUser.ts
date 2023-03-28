import type { User } from "@clerk/nextjs/dist/api";

export const filterUser = (user: User) => {
  const { id, username, profileImageUrl } = user;
  return { id, username, profileImageUrl };
};
