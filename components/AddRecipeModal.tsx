'use client';
import { useState } from 'react';
import RecipeForm from './RecipeForm';

export default function AddRecipeModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-headline">Add new Recipe</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-4 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-red-600">✕</button>
            <RecipeForm />
          </div>
        </div>
      )}
    </div>
  );
}
