import { comparePassword } from "@/lib/hash"
import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        // Retorna erro caso o e-mail não seja encontrado
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user)
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 },
            )

        // Retorna erro caso a senha não esteja correta
        const valid = await comparePassword(password, user.password)
        if (!valid)
            return NextResponse.json(
                { error: "Senha incorreta" },
                { status: 401 },
            )

        const token = await signToken({ id: user.id, email: user.email })
        const response = NextResponse.json(
            { message: "Login bem sucedido" },
            { status: 200 },
        )

        // O token é anexado no cookie de resposta
        // - httpOnly: impede acesso via JS
        // - maxAge: segundos * minutos * horas * dias
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        })

        return response
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}
