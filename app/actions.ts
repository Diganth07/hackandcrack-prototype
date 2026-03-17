"use server";

export async function verifyAdminPassword(password: string) {
  // If the environment variable isn't found, default to 'admin123' so users are not locked out
  const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === correctPassword;
}
