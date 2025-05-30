import { PrismaClient } from "@prisma/client"

// Força o TS a criar um objeto com a chave prisma
// Transforma globalThis em unknown e depois no objeto
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Utiliza uma instância se ela existir ou cria se não existir
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
