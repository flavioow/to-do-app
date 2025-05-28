import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'changeme')

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (err) {
    return null
  }
}
