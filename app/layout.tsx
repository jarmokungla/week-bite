import './globals.css'
import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'

export const metadata = {
  title: 'Recipe Planner',
  description: 'Recipes • Shopping • Weekly Menu',
}

async function UserMenu() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
    if (!user) {
    return (
      <Link href="/login" className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryDark transition-colors">
        Log in
      </Link>
    )
  }
  async function signOut() {
    'use server'
    const supabase = supabaseServer();
    await supabase.auth.signOut();
    redirect('/login');
  }
  return (
    <form action={signOut}>
      <Button type="submit" className="bg-primaryDark hover:bg-primaryDark">
        Sign out
      </Button>
    </form>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <header className="bg-surface text-headline shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">🥗 Recipe Planner</Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/recipes" className="hover:text-primary">Recipes</Link>
              <Link href="/shopping" className="hover:text-primary">Shopping</Link>
              <Link href="/menu" className="hover:text-primary">Weekly Menu</Link>
              <Link href="/friends" className="hover:text-primary">Friends</Link>
            </nav>
            <UserMenu />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="bg-surface border-t border-muted/20 mt-10 text-center text-sm text-muted py-6">
          Built with Next.js, Tailwind, Supabase
        </footer>
      </body>
    </html>
  )
}
