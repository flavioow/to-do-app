import { getUserIdFromToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Listagem de TO-DO
export async function GET(req: Request) {
    try {
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

        const tasks = await prisma.task.findMany({
            where: { userId },
            select: { id: true, title: true, status: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(
            tasks,
            { status: 200 },
        )
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}

// Criação de TO-DO
export async function POST(req: Request) {
    try {
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

        const { title, body } = await req.json()

        const task = await prisma.task.create({
            data: { title, body, userId },
        })

        return NextResponse.json(task)
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}
