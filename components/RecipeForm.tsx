'use client';
import { useState } from 'react';
import UploadImage from './UploadImage';
import { createRecipe } from '@/lib/actions';
import type { IngredientInput } from '@/lib/types';

export default function RecipeForm({ bookId }: { bookId?: string | null }) {
  const [title, setTitle] = useState('');
  const [directions, setDirections] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<IngredientInput[]>([{ name: '' }]);

  function updateIng(i: number, key: keyof IngredientInput, value: string) {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [key]: value } : ing));
  }
  function addIng() { setIngredients(prev => [...prev, { name: '' }]); }
  function removeIng(i: number) { setIngredients(prev => prev.filter((_, idx) => idx !== i)); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = ingredients.filter(i => i.name.trim().length);
    await createRecipe({ title, directions, image_url: imageUrl, ingredients: cleaned, book_id: bookId ?? null });
    setTitle(''); setDirections(''); setImageUrl(null); setIngredients([{ name: '' }]);
  }

  return (
    <form onSubmit={onSubmit} className="p-4 border rounded-2xl space-y-3">
      <h3 className="font-medium">New Recipe</h3>
      <input className="w-full border rounded-xl px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea className="w-full border rounded-xl px-3 py-2" placeholder="Directions" rows={4} value={directions} onChange={e => setDirections(e.target.value)} />
      <div className="flex items-center gap-3">
        <UploadImage onUploaded={setImageUrl} />
        {imageUrl && <img src={imageUrl} alt="preview" className="h-16 w-16 rounded object-cover border" />}
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Ingredients</p>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input className="col-span-6 border rounded-xl px-3 py-2" placeholder="Name" value={ing.name} onChange={e => updateIng(i,'name',e.target.value)} />
              <input className="col-span-3 border rounded-xl px-3 py-2" placeholder="Qty" value={ing.quantity ?? ''} onChange={e => updateIng(i,'quantity',e.target.value)} />
              <input className="col-span-2 border rounded-xl px-3 py-2" placeholder="Unit" value={ing.unit ?? ''} onChange={e => updateIng(i,'unit',e.target.value)} />
              <button type="button" onClick={() => removeIng(i)} className="col-span-1 text-sm text-red-600">✕</button>
            </div>
          ))}
          <button type="button" onClick={addIng} className="text-sm text-primary">+ Add ingredient</button>
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-primary text-white">Save Recipe</button>
    </form>
  )
}
