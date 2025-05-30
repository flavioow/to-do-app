import { verifyToken } from "./jwt"

export async function getUserIdFromToken(
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
