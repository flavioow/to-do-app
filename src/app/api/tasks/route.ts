import { getUserIdFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Listagem de TO-DO
export async function GET(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req)
        if (userId instanceof NextResponse) return userId

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
        const userId = await getUserIdFromRequest(req)
        if (userId instanceof NextResponse) return userId

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
