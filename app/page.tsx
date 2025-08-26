import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function Home() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const authed = !!data.user;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome{authed ? '' : ' — please log in'}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/recipes" className="block p-4 border rounded-2xl shadow-sm hover:shadow-md">
          <h3 className="font-medium mb-1">Add a recipe</h3>
          <p className="text-sm text-muted">Keep your recipes organized and attach images.</p>
        </Link>
        <Link href="/shopping" className="block p-4 border rounded-2xl shadow-sm hover:shadow-md">
          <h3 className="font-medium mb-1">Shopping list</h3>
          <p className="text-sm text-muted">Aggregate ingredients — check items off at the store.</p>
        </Link>
        <Link href="/menu" className="block p-4 border rounded-2xl shadow-sm hover:shadow-md">
          <h3 className="font-medium mb-1">Plan next week</h3>
          <p className="text-sm text-muted">Drag recipes onto days (or quick-add with a click).</p>
        </Link>
      </div>
    </div>
  )
}
