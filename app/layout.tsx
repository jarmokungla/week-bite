import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Week Bite',
  description: 'Recipes • Shopping • Weekly Menu',
}

async function UserMenu() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return <Link href="/login" className="px-4 py-2 rounded-full bg-accent text-headline text-sm">Log in</Link>
  }
  async function signOut() {
    'use server'
    const supabase = supabaseServer();
    await supabase.auth.signOut();
    redirect('/login');
  }
  return (
    <form action={signOut}>
      <button className="text-sm px-4 py-2 rounded-full bg-accent text-headline">Sign out</button>
    </form>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <header className="border-b border-primary/25 bg-surface sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-headline">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Week Bite" width={120} height={40} priority />
            </Link>
            <nav className="w-full sm:w-auto flex flex-wrap justify-center gap-2 text-sm">
              <Link href="/recipes" className="px-4 py-2 rounded-full bg-primary text-headline hover:bg-primaryDark">Recipes</Link>
              <Link href="/shopping" className="px-4 py-2 rounded-full bg-primary text-headline hover:bg-primaryDark">Shopping</Link>
              <Link href="/menu" className="px-4 py-2 rounded-full bg-primary text-headline hover:bg-primaryDark">Weekly Menu</Link>
              <Link href="/friends" className="px-4 py-2 rounded-full bg-primary text-headline hover:bg-primaryDark">Friends</Link>
            </nav>
            <div className="flex sm:ml-auto">
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-primary/25 mt-10 text-center text-sm text-muted py-6">Built with Next.js, Tailwind, Supabase</footer>
      </body>
    </html>
  )
}
