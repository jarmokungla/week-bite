import { supabaseServer } from '@/lib/supabaseServer'
import { nextMonday, weekdayNames, dateForNextWeekDay } from '@/lib/date'
import { redirect } from 'next/navigation'

export default async function MenuPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  const weekStart = nextMonday(new Date()).toISOString().slice(0,10);

  const { data: menu } = await supabase
    .from('weekly_menus')
    .select('id')
    .match({ owner_id: data.user.id, week_start_date: weekStart })
    .maybeSingle();

  let items: any[] = [];
  if (menu) {
    const res = await supabase
      .from('weekly_menu_items')
      .select('id, date, meal_type, recipes ( id, title, image_url )')
      .eq('menu_id', menu.id)
      .order('date', { ascending: true });
    items = res.data ?? [];
  }

  const map = new Map<string, any[]>();
  for (let d=1; d<=7; d++) {
    map.set(dateForNextWeekDay(d).toISOString().slice(0,10), []);
  }
  for (const i of items) {
    const key = i.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(i);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Next Week&apos;s Menu</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6,7].map(d => {
          const date = dateForNextWeekDay(d);
          const key = date.toISOString().slice(0,10);
          const dayItems = map.get(key) ?? [];
          return (
            <div key={d} className="border rounded-2xl p-3">
              <div className="font-medium mb-2">{weekdayNames[d]} <span className="text-muted text-xs">({key})</span></div>
              <div className="space-y-2">
                {dayItems.length === 0 && <p className="text-sm text-muted">No recipes yet. Add from the Recipes page.</p>}
                {dayItems.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2">
                    {item.recipes?.image_url ? <img src={item.recipes.image_url} className="h-10 w-10 rounded object-cover border" /> : <div className="h-10 w-10 rounded bg-gray-100" />}
                    <div>{item.recipes?.title ?? 'Untitled'}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
