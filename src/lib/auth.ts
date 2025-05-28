import { verifyToken } from "./jwt"

export async function getUserIdFromToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;

  const payload = await verifyToken(token);
  if (payload && "id" in payload) return payload.id as string;

  return null;
}
