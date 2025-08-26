import RecipeForm from '@/components/RecipeForm'
import RecipeList from '@/components/RecipeList'
import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function RecipesPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  // list recipes I own or shared to me via book_shares
  const { data: recipes } = await supabase
    .from('recipes_with_access')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <RecipeForm />
      <div>
        <h2 className="font-semibold text-lg mb-2">Your Recipes</h2>
        <RecipeList recipes={(recipes ?? []).map(r => ({ id: r.id, title: r.title, image_url: r.image_url }))} />
      </div>
    </div>
  )
}
