'use client';
import { deleteRecipe } from '@/lib/actions';

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  async function onDelete() {
    if (confirm('Delete this recipe?')) {
      await deleteRecipe(recipeId);
      window.location.href = '/recipes';
    }
  }
  return (
    <button onClick={onDelete} className="px-3 py-2 border border-primary/25 rounded-xl bg-surface text-red-600">Delete</button>
  );
}
