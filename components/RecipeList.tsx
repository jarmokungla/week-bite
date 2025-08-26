import Link from 'next/link'
import { addIngredientsToShoppingList, addRecipeToNextWeekMenu } from '@/lib/actions'
import { weekdayNames } from '@/lib/date'

type Recipe = {
  id: string;
  title: string;
  image_url: string | null;
};

export default function RecipeList({ recipes }:{ recipes: Recipe[] }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recipes.map(r => (
        <div key={r.id} className="border border-primary/25 bg-surface rounded-2xl overflow-hidden">
          {r.image_url ? <img src={r.image_url} alt="" className="w-full h-40 object-cover" /> : <div className="h-40 bg-surface" />}
          <div className="p-3">
            <div className="font-medium mb-2 text-headline">{r.title}</div>
            <div className="flex flex-wrap gap-2">
              <form action={addIngredientsToShoppingList.bind(null, r.id)}>
                <button className="text-sm px-3 py-1 border border-primary/25 rounded-xl bg-surface">Add to shopping list</button>
              </form>
              <details className="text-sm">
                <summary className="px-3 py-1 border border-primary/25 rounded-xl cursor-pointer select-none inline-block bg-surface">Add to next week</summary>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[1,2,3,4,5,6,7].map(d => (
                    <form key={d} action={async () => { 'use server'; await addRecipeToNextWeekMenu(r.id, d as any) }}>
                      <button className="px-2 py-1 border border-primary/25 rounded-xl w-full bg-surface">{weekdayNames[d]}</button>
                    </form>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
