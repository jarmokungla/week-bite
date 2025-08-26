import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
    const response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // or PUBLISHABLE key
        {
            cookies: {
                // read cookies from the incoming request
                getAll: () => request.cookies.getAll(),
                // write any refreshed cookies to the outgoing response
                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // IMPORTANT: use getUser() here so tokens are validated & refreshed
    await supabase.auth.getUser()
    return response
}
