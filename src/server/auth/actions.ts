import { db } from "@/server/db";

export async function getUser(email: string, pwHash: string) {
  const user = await db.user.findFirst({
    where: {
      AND: [{ OR: [{ email: email }] }, { userIsDeleted: false }],
    },
  });

  if (!user) {
    return null;
  }

  // Verify that the password hash matches the stored hash
  if (user.password !== pwHash) {
    return null;
  }

  return user;
}
