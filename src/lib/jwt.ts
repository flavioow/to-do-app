import { type JWTPayload, SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "changeme",
)

export async function signToken(payload: JWTPayload): Promise<string> {
    // Cria um token
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime("30d")
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        // Verifica a assinaruta e extrai o payload
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch {
        return null
    }
}
