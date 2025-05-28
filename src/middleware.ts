import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

export async function middleware(req: NextRequest) {
  try {
    const tokenFromCookie = req.cookies.get('token')?.value
    const authHeader = req.headers.get('Authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
    const token = tokenFromCookie || tokenFromHeader

    const url = req.nextUrl.pathname

    const protectedPaths = ['/api/tasks']
    const authPaths = ['/api/auth/login', '/api/auth/register']

    if (protectedPaths.some(path => url.startsWith(path))) {
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Token não fornecido' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const verified = await verifyToken(token)
      if (!verified) {
        return new NextResponse(JSON.stringify({ error: 'Token inválido ou expirado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    if (authPaths.some(path => url.startsWith(path))) {
      if (token && (await verifyToken(token))) {
        return new NextResponse(JSON.stringify({ error: 'Usuário já autenticado' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return NextResponse.next()
  } catch (err) {
    console.error('[Middleware] Erro inesperado:', err)
    return new NextResponse(JSON.stringify({ error: 'Erro interno no middleware' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  matcher: ['/api/tasks/:path*', '/api/auth/login', '/api/auth/register'],
}
