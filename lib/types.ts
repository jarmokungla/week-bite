export type IngredientInput = {
  name: string;
  quantity?: string;
  unit?: string;
};

export type RecipeInput = {
  title: string;
  directions?: string;
  image_url?: string | null;
  ingredients: IngredientInput[];
  book_id?: string | null;
};

export type Weekday =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
