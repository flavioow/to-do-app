import { verifyToken } from "./jwt"
import { NextRequest, NextResponse } from "next/server"

async function getUserIdFromToken(
    // O token pode ser string OU indefinido
    // Retorna uma Promise, que quando resolvida, entrega string OU nulo
    token: string | undefined,
): Promise<string | null> {
    if (!token) return null

    const payload = await verifyToken(token)

    // - "in": verifica se uma chave existe dentro de um objeto
    // - "as": força o TS a tratar como um tipo de valor
    if (payload && "id" in payload) return payload.id as string

    return null
}

export async function getUserIdFromRequest(req: Request | NextRequest) {
    // O token é enviado para Authorization, no formato: Bearer <token>
    // Portanto, remove-se o prefixo para obter apenas o token
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")
    const userId = await getUserIdFromToken(token)

    // Retorna erro se o token for inválido ou ausente
    if (!userId)
        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 },
        )

    return userId
}
