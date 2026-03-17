"use server";

export async function verifyAdminPassword(password: string) {
  // If the environment variable isn't found, default to 'private1$' so users are not locked out
  const correctPassword = process.env.ADMIN_PASSWORD || "private1$";
  return password === correctPassword;
}
