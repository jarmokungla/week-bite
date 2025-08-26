import { supabaseServer } from '@/lib/supabaseServer';
import { addIngredientsToShoppingList, addRecipeToNextWeekMenu } from '@/lib/actions';
import { weekdayNames } from '@/lib/date';
import { redirect, notFound } from 'next/navigation';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!recipe) notFound();

  const { data: ingredients } = await supabase
    .from('recipe_ingredients')
    .select('id, name, quantity, unit')
    .eq('recipe_id', params.id);

  return (
    <div className="space-y-4">
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt=""
          className="w-full h-64 object-cover rounded-2xl border border-primary/25"
        />
      )}
      <h1 className="text-xl font-semibold text-headline">{recipe.title}</h1>
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((t: string) => (
            <span key={t} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full text-headline">{t}</span>
          ))}
        </div>
      )}
      {ingredients && ingredients.length > 0 && (
        <div>
          <h2 className="font-medium text-headline mb-1">Ingredients</h2>
          <ul className="list-disc pl-5 space-y-1">
            {ingredients.map(i => (
              <li key={i.id}>
                {i.name}
                {i.quantity ? ` — ${i.quantity} ${i.unit ?? ''}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      {recipe.directions && (
        <div>
          <h2 className="font-medium text-headline mb-1">Directions</h2>
          <p className="whitespace-pre-line text-body">{recipe.directions}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <form action={addIngredientsToShoppingList.bind(null, recipe.id)}>
          <button className="text-sm px-3 py-1 border border-primary/25 rounded-xl bg-surface">
            Add to shopping list
          </button>
        </form>
        <details className="text-sm">
          <summary className="px-3 py-1 border border-primary/25 rounded-xl cursor-pointer select-none inline-block bg-surface">
            Add to next week
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[1,2,3,4,5,6,7].map(d => (
              <form key={d} action={async () => { 'use server'; await addRecipeToNextWeekMenu(recipe.id, d as any); }}>
                <button className="px-2 py-1 border border-primary/25 rounded-xl w-full bg-surface">
                  {weekdayNames[d]}
                </button>
              </form>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
