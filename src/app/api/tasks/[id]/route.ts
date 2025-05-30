import { getUserIdFromToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// Atualização de TO-DO
export async function PUT(
    /*  Em rotas dinâmicas no Next.js, é enviado automaticamente um objeto
        "context" para o handler da rota. O context contém "params", que
        corresponde aos valores das partes dinâmicas da URL. */

    // Exemplo: em uma requisição para rota "api/tasks/123"
    // - context.params será: { id: "123" }
    req: NextRequest,
    context: { params: { id: string } },
) {
    try {
        const { params } = context

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

        const { title, body, status } = await req.json()

        const updated = await prisma.task.updateMany({
            where: { id: params.id, userId },
            data: { title, body, status },
        })

        // Retorna erro caso a tarefa não seja encontrada
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

// Exclusão de TO-DO
export async function DELETE(
    /*  Em rotas dinâmicas no Next.js, é enviado automaticamente um objeto
        "context" para o handler da rota. O context contém "params", que
        corresponde aos valores das partes dinâmicas da URL. */

    // Exemplo: em uma requisição para rota "api/tasks/123"
    // - context.params será: { id: "123" }
    req: NextRequest,
    context: { params: { id: string } },
) {
    try {
        const { params } = context

        // O token é enviado para Authorization, no formato: Bearer <token>
        // Portanto, remove-se o prefixo para obter apenas o token
        const token = req.headers.get("Authorization")?.replace("Bearer ", "")
        const userId = await getUserIdFromToken(token)

        // Retorna erro se o token for inválido ou ausente
        if (!userId) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 },
            )
        }

        const deleted = await prisma.task.deleteMany({
            where: { id: params.id, userId },
        })

        // Retorna erro caso a tarefa não seja encontrada
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
