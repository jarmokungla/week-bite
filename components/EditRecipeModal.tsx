'use client';
import { useState } from 'react';
import RecipeForm from './RecipeForm';
import type { IngredientInput } from '@/lib/types';

type RecipeForEdit = {
  id: string;
  title: string;
  directions?: string | null;
  image_url?: string | null;
  ingredients: IngredientInput[];
  book_id?: string | null;
  tags?: string[];
};

export default function EditRecipeModal({ recipe }: { recipe: RecipeForEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-headline">Edit</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-4 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-red-600">✕</button>
            <RecipeForm recipe={recipe} onSaved={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
