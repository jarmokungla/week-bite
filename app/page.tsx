import { supabaseServer } from '@/lib/supabaseServer'
import FeatureCard from '@/components/ui/FeatureCard'

export default async function Home() {
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-3xl p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-headline">Hello{user ? `, ${user.email}` : ''}</h1>
        <p className="text-sm text-muted mt-1">What would you like to do today?</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          href="/recipes"
          title="Recipes"
          description="Keep your recipes organized and attach images."
          icon="📖"
          action="Open"
        />
        <FeatureCard
          href="/shopping"
          title="Shopping list"
          description="Aggregate ingredients — check items off at the store."
          icon="🛒"
          action="View"
        />
        <FeatureCard
          href="/menu"
          title="Weekly menu"
          description="Drag recipes onto days (or quick-add with a click)."
          icon="📅"
          action="Plan"
        />
        <FeatureCard
          href="/friends"
          title="Friends"
          description="Share recipe books with friends."
          icon="👥"
          action="Browse"
        />
      </div>
    </div>
  )
}
