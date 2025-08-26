import './globals.css'
import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Recipe Planner',
  description: 'Recipes • Shopping • Weekly Menu',
}

async function UserMenu() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return <Link href="/login" className="text-sm px-3 py-1 rounded bg-primary text-white">Log in</Link>
  }
  async function signOut() {
    'use server'
    const supabase = supabaseServer();
    await supabase.auth.signOut();
    redirect('/login');
  }
  return (
    <form action={signOut}>
      <button className="text-sm px-3 py-1 rounded bg-primaryDark text-white">Sign out</button>
    </form>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">🥗 Recipe Planner</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/recipes" className="hover:text-primary">Recipes</Link>
              <Link href="/shopping" className="hover:text-primary">Shopping</Link>
              <Link href="/menu" className="hover:text-primary">Weekly Menu</Link>
              <Link href="/friends" className="hover:text-primary">Friends</Link>
            </nav>
            {/* @ts-expect-error async server component */}
            <UserMenu />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t mt-10 text-center text-sm text-muted py-6">Built with Next.js, Tailwind, Supabase</footer>
      </body>
    </html>
  )
}
