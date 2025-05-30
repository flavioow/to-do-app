import { comparePassword } from "@/lib/hash"
import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const email = body.email
        const password = body.password

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user)
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 },
            )

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
