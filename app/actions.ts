"use server";

export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  return password === correctPassword;
}
