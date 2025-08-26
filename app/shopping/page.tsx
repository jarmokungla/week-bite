import { supabaseServer } from '@/lib/supabaseServer'
import { toggleShoppingItem } from '@/lib/actions'
import { redirect } from 'next/navigation'

export default async function ShoppingPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) { redirect('/login'); }

  const { data: list } = await supabase
    .from('shopping_lists')
    .select('id')
    .match({ owner_id: data.user.id, is_active: true })
    .maybeSingle();

  let items: any[] = [];
  if (list) {
    const res = await supabase.from('shopping_list_items').select('*').eq('list_id', list.id).order('created_at', { ascending: true });
    items = res.data ?? [];
  } else {
    items = [];
  }

  async function clearChecked(listId?: string) {
    'use server';
    const supa = supabaseServer();
    if (listId) {
      await supa.from('shopping_list_items').delete().eq('list_id', listId).eq('checked', true);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-headline">Shopping List</h1>
      <div className="space-y-2">
        {items && items.length === 0 && <p className="text-muted">No items yet — add some from a recipe.</p>}
        {items && items.map(i => (
          <form key={i.id} action={toggleShoppingItem.bind(null, i.id, !i.checked)} className="flex items-center gap-3 border border-primary/25 bg-surface rounded-xl px-3 py-2">
            <button className={"h-5 w-5 rounded border border-primary/25 " + (i.checked ? "bg-primary" : "bg-surface") } aria-label="toggle" />
            <div className={"flex-1 " + (i.checked ? "line-through text-muted" : "text-headline")}> 
              {i.name} {i.quantity ? `— ${i.quantity} ${i.unit ?? ''}` : ''}
            </div>
          </form>
        ))}
      </div>
      <form action={clearChecked.bind(null, list?.id ?? null)}>
        <button className="text-sm text-red-600">Remove checked items</button>
      </form>
    </div>
  )
}
