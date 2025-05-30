import { getUserIdFromToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
    req: NextRequest,
    context: { params: { id: string } },
) {
    try {
        const { params } = context
        const token = req.headers.get("Authorization")?.replace("Bearer ", "")
        const userId = await getUserIdFromToken(token)

        if (!userId)
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 },
            )

        const { title, body, status } = await req.json()

        const updated = await prisma.task.updateMany({
            where: { id: params.id, userId },
            data: { title, body, status },
        })

        if (updated.count === 0)
            return NextResponse.json(
                { error: "To-do não encontrado ou sem permissão" },
                { status: 404 },
            )

        return NextResponse.json(
            { success: true },
            { status: 200 },
        )
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } },
) {
    try {
        const { params } = context
        const token = req.headers.get("Authorization")?.replace("Bearer ", "")
        const userId = await getUserIdFromToken(token)

        if (!userId) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 },
            )
        }

        const deleted = await prisma.task.deleteMany({
            where: { id: params.id, userId },
        })

        if (deleted.count === 0) {
            return NextResponse.json(
                { error: "To-do não encontrado ou sem permissão" },
                { status: 404 },
            )
        }

        return NextResponse.json(
            { success: true },
            { status: 200 },
        )
    } catch {
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 },
        )
    }
}
