import AddRecipeModal from '@/components/AddRecipeModal';
import RecipeList from '@/components/RecipeList';
import { supabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function RecipesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'created_desc';
  let column = 'created_at';
  let ascending = false;
  if (sortParam === 'created_asc') { column = 'created_at'; ascending = true; }
  if (sortParam === 'title_asc') { column = 'title'; ascending = true; }
  if (sortParam === 'title_desc') { column = 'title'; ascending = false; }

  const tagFilter = typeof searchParams.tag === 'string' ? searchParams.tag : '';
  const page = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10);
  const pageSize = 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('recipes_with_access')
    .select('id,title,image_url,tags,created_at', { count: 'exact' })
    .order(column, { ascending });
  if (tagFilter) query = query.contains('tags', [tagFilter]);
  const { data: recipes, count } = await query.range(from, to);
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  const makePageLink = (p: number) => {
    const params = new URLSearchParams();
    if (sortParam) params.set('sort', sortParam);
    if (tagFilter) params.set('tag', tagFilter);
    params.set('page', String(p));
    return `/recipes?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-headline">Your Recipes</h2>
        <AddRecipeModal />
      </div>
      <form className="flex flex-wrap gap-2 items-end" method="get">
        <div>
          <label className="text-sm block mb-1">Sort</label>
          <select name="sort" defaultValue={sortParam} className="border border-primary/25 rounded-xl px-3 py-2 bg-surface">
            <option value="created_desc">Newest</option>
            <option value="created_asc">Oldest</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>
        <div>
          <label className="text-sm block mb-1">Tag</label>
          <input name="tag" defaultValue={tagFilter} className="border border-primary/25 rounded-xl px-3 py-2 bg-surface" />
        </div>
        <input type="hidden" name="page" value="1" />
        <button className="px-3 py-2 border border-primary/25 rounded-xl bg-surface">Apply</button>
      </form>
      <RecipeList recipes={(recipes ?? []).map(r => ({ id: r.id, title: r.title, image_url: r.image_url, tags: r.tags }))} />
      <div className="flex justify-between">
        {page > 1 && (
          <a href={makePageLink(page - 1)} className="px-3 py-1 border border-primary/25 rounded-xl bg-surface">Previous</a>
        )}
        {page < totalPages && (
          <a href={makePageLink(page + 1)} className="px-3 py-1 border border-primary/25 rounded-xl bg-surface ml-auto">Next</a>
        )}
      </div>
    </div>
  );
}
