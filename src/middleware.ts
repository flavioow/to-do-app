import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

export async function middleware(req: NextRequest) {
    try {
        const tokenFromCookie = req.cookies.get("token")?.value

        // Extrai o token do header, separando o token do prefixo
        const authHeader = req.headers.get("Authorization")
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : null

        // Usa token do cookie se houver, ou usa do header
        const token = tokenFromCookie || tokenFromHeader

        const url = req.nextUrl.pathname

        const protectedPaths = ["/api/tasks"]
        const authPaths = ["/api/auth/login", "/api/auth/register"]

        // Se a rota por protegida ou for um subcaminho de uma
        if (protectedPaths.some((path) => url.startsWith(path))) {
            // Retorna erro caso não haja token
            if (!token) {
                return new NextResponse(
                    JSON.stringify({ error: "Token não fornecido" }),
                    {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    },
                )
            }

            // Retorna erro caso houver token inválido
            const verified = await verifyToken(token)
            if (!verified) {
                return new NextResponse(
                    JSON.stringify({ error: "Token inválido ou expirado" }),
                    {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    },
                )
            }
        }

        // Se a rota for de autenticação ou for um subcaminho de uma
        if (authPaths.some((path) => url.startsWith(path))) {
            // Retorna erro se o usuário já estiver autenticado
            if (token && (await verifyToken(token))) {
                return new NextResponse(
                    JSON.stringify({ error: "Usuário já autenticado" }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                )
            }
        }

        return NextResponse.next()
    } catch {
        return new NextResponse(
            JSON.stringify({ error: "Erro interno no middleware" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        )
    }
}

export const config = {
    matcher: ["/api/tasks/:path*", "/api/auth/login", "/api/auth/register"],
}
