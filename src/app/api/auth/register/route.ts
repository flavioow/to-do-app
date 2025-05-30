import { hashPassword } from "@/lib/hash"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const emailExisting = await prisma.user.findUnique({ where: { email } })
        if (emailExisting)
            return NextResponse.json(
                { error: "Email já cadastrado" },
                { status: 400 },
            )

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        return NextResponse.json(
            { id: user.id, email: user.email },
            { status: 201 },
        )
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}
