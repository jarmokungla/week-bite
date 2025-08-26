'use server';

import { supabaseServer } from '@/lib/supabaseServer';
import { nextMonday, dateForNextWeekDay } from '@/lib/date';
import { revalidatePath } from 'next/cache';
import type { RecipeInput } from '@/lib/types';

export async function requireUser() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Not authenticated');
  return data.user;
}

export async function createRecipe(data: RecipeInput) {
  const user = await requireUser();
  const supabase = supabaseServer();

  const { data: recipe, error } = await supabase
    .from('recipes')
    .insert({
      owner_id: user.id,
      title: data.title,
      directions: data.directions ?? null,
      image_url: data.image_url ?? null,
      book_id: data.book_id ?? null,
      tags: data.tags ?? [],
    })
    .select()
    .single();

  if (error) throw error;

  if (data.ingredients?.length) {
    const rows = data.ingredients.map(i => ({
      recipe_id: recipe.id,
      name: i.name,
      quantity: i.quantity ?? null,
      unit: i.unit ?? null
    }));
    const { error: err2 } = await supabase.from('recipe_ingredients').insert(rows);
    if (err2) throw err2;
  }

  revalidatePath('/recipes');
  return recipe;
}

export async function updateRecipe(recipeId: string, data: RecipeInput) {
  const user = await requireUser();
  const supabase = supabaseServer();

  const { error } = await supabase
    .from('recipes')
    .update({
      title: data.title,
      directions: data.directions ?? null,
      image_url: data.image_url ?? null,
      book_id: data.book_id ?? null,
      tags: data.tags ?? [],
    })
    .eq('id', recipeId)
    .eq('owner_id', user.id);
  if (error) throw error;

  const { error: delErr } = await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', recipeId);
  if (delErr) throw delErr;

  if (data.ingredients?.length) {
    const rows = data.ingredients.map(i => ({
      recipe_id: recipeId,
      name: i.name,
      quantity: i.quantity ?? null,
      unit: i.unit ?? null,
    }));
    const { error: insErr } = await supabase
      .from('recipe_ingredients')
      .insert(rows);
    if (insErr) throw insErr;
  }

  revalidatePath('/recipes');
  revalidatePath(`/recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: string) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('owner_id', user.id);
  if (error) throw error;
  revalidatePath('/recipes');
  revalidatePath(`/recipes/${recipeId}`);
}

export async function addIngredientsToShoppingList(recipeId: string) {
  const user = await requireUser();
  const supabase = supabaseServer();

  // Ensure active list
  const { data: listRow, error: listErr } = await supabase
    .from('shopping_lists')
    .select('*')
    .match({ owner_id: user.id, is_active: true })
    .maybeSingle();
  if (listErr) throw listErr;

  let listId = listRow?.id;
  if (!listId) {
    const { data: created, error: createErr } = await supabase
      .from('shopping_lists')
      .insert({ owner_id: user.id, title: 'My List', is_active: true })
      .select()
      .single();
    if (createErr) throw createErr;
    listId = created.id;
  }

  // Pull ingredients
  const { data: ings, error: ingErr } = await supabase
    .from('recipe_ingredients')
    .select('name, quantity, unit')
    .eq('recipe_id', recipeId);
  if (ingErr) throw ingErr;

  if (!ings || ings.length === 0) return;

  const items = ings.map(i => ({
    list_id: listId,
    name: i.name,
    quantity: i.quantity,
    unit: i.unit,
    checked: false,
    source_recipe_id: recipeId
  }));

  const { error } = await supabase.from('shopping_list_items').insert(items);
  if (error) throw error;
  revalidatePath('/shopping');
}

export async function toggleShoppingItem(itemId: string, checked: boolean) {
  await requireUser();
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('shopping_list_items')
    .update({ checked })
    .eq('id', itemId);
  if (error) throw error;
  revalidatePath('/shopping');
}

export async function addRecipeToNextWeekMenu(recipeId: string, weekday: number) {
  const user = await requireUser();
  const supabase = supabaseServer();

  const weekStart = nextMonday(new Date()).toISOString().slice(0,10);

  // Ensure weekly menu row
  const { data: menu, error: menuErr } = await supabase
    .from('weekly_menus')
    .select('*')
    .match({ owner_id: user.id, week_start_date: weekStart })
    .maybeSingle();
  if (menuErr) throw menuErr;

  let menuId = menu?.id;
  if (!menuId) {
    const { data: created, error: createErr } = await supabase
      .from('weekly_menus')
      .insert({ owner_id: user.id, week_start_date: weekStart })
      .select()
      .single();
    if (createErr) throw createErr;
    menuId = created.id;
  }

  const dayDate = dateForNextWeekDay(weekday).toISOString().slice(0,10);
  const { error } = await supabase
    .from('weekly_menu_items')
    .insert({ menu_id: menuId, date: dayDate, recipe_id: recipeId, meal_type: 'dinner' });
  if (error) throw error;
  revalidatePath('/menu');
}

export async function createFriendByPhone(phone: string) {
  const user = await requireUser();
  const supabase = supabaseServer();

  // find profile by phone
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!profile) throw new Error('No user with that phone.');

  const { error } = await supabase
    .from('friends')
    .insert({ user_id: user.id, friend_id: profile.id, status: 'pending' });
  if (error) throw error;
  revalidatePath('/friends');
}

export async function acceptFriend(friendUserId: string) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .match({ user_id: friendUserId, friend_id: user.id });
  if (error) throw error;
  revalidatePath('/friends');
}

export async function createBook(name: string) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const { error } = await supabase.from('recipe_books').insert({ owner_id: user.id, name });
  if (error) throw error;
  revalidatePath('/recipes');
}

export async function shareBook(bookId: string, userId: string, permission: 'view'|'edit'='view') {
  const user = await requireUser();
  const supabase = supabaseServer();

  // ensure owner
  const { data: book, error: bErr } = await supabase
    .from('recipe_books')
    .select('owner_id')
    .eq('id', bookId)
    .single();
  if (bErr) throw bErr;
  if (book.owner_id !== user.id) throw new Error('Only owner can share');

  const { error } = await supabase
    .from('book_shares')
    .upsert({ book_id: bookId, user_id: userId, permission });
  if (error) throw error;
  revalidatePath('/recipes');
}
