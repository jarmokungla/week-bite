// @ts-nocheck
'use client'
import { useMemo, useState } from 'react'

// --- Theme ---------------------------------------------------------------
const theme = {
  primary: '#F97316', // orange-500
  primaryDark: '#EA580C', // orange-600
  bg: '#0B0F14',
  card: '#171B21',
  card2: '#12161B',
  text: '#E5E7EB',
  muted: '#94A3B8',
  ring: 'rgba(249,115,22,0.35)'
}

// --- Utilities -----------------------------------------------------------
function slug(s){ return s.toLowerCase() }

const foodImages = {
  sugar: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=400&auto=format&fit=crop',
  oil: 'https://images.unsplash.com/photo-1524594081293-190a2fe0baae?q=80&w=400&auto=format&fit=crop',
  eggs: 'https://images.unsplash.com/photo-1517959105821-eaf2591984dd?q=80&w=400&auto=format&fit=crop',
  ricotta: 'https://images.unsplash.com/photo-1615486363876-08ccf80ad7a8?q=80&w=400&auto=format&fit=crop',
  tangerine: 'https://images.unsplash.com/photo-1547517023-6f5a44c23238?q=80&w=400&auto=format&fit=crop',
  shrimp: 'https://images.unsplash.com/photo-1604908553993-93c26df57949?q=80&w=400&auto=format&fit=crop',
  garlic: 'https://images.unsplash.com/photo-1519163214324-67cc5a1f8e09?q=80&w=400&auto=format&fit=crop',
  chili: 'https://images.unsplash.com/photo-1506808547685-e2ba962dedf0?q=80&w=400&auto=format&fit=crop',
  lemon: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=400&auto=format&fit=crop',
  beef: 'https://images.unsplash.com/photo-1604908811280-9e9d3d3f7a59?q=80&w=400&auto=format&fit=crop',
  bun: 'https://images.unsplash.com/photo-1604908554165-5bff1dd6ec8e?q=80&w=400&auto=format&fit=crop',
  cheddar: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400&auto=format&fit=crop',
  pickles: 'https://images.unsplash.com/photo-1604908812237-6f0ca6c58445?q=80&w=400&auto=format&fit=crop',
  onions: 'https://images.unsplash.com/photo-1563746090494-b6a0a7f1a1d1?q=80&w=400&auto=format&fit=crop',
  sauce: 'https://images.unsplash.com/photo-1589308078054-8322b803fcb5?q=80&w=400&auto=format&fit=crop',
  lettuce: 'https://images.unsplash.com/photo-1566843972146-1b0b2c951f86?q=80&w=400&auto=format&fit=crop',
  avocado: 'https://images.unsplash.com/photo-1546470427-0fd4b3c4a2f6?q=80&w=400&auto=format&fit=crop',
  cucumber: 'https://images.unsplash.com/photo-1604908811709-8f0f91982466?q=80&w=400&auto=format&fit=crop',
  dressing: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop'
}

function foodImageFor(label){
  const l = slug(label)
  for (const key of Object.keys(foodImages)) {
    if (l.includes(key)) return foodImages[key]
  }
  return foodImages.default
}

// --- Small UI Primitives -------------------------------------------------
function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition p-3 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Pill({ children, className = '' }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 ${className}`}>{children}</span>
  )
}

function RatingStars({ value = 4.6, size = 14 }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {stars.map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(value) ? 'currentColor' : 'none'} stroke="currentColor" className="drop-shadow">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.01 5.112a.563.563 0 00.475.354l5.518.401c.499.036.702.665.322.995l-4.204 3.595a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.37 20.508a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L2.43 10.36a.563.563 0 01.322-.995l5.518-.401a.563.563 0 00.475-.354l2.01-5.112z" />
        </svg>
      ))}
      <span className="text-xs ml-1 text-slate-300">{value.toFixed(1)}</span>
    </div>
  )
}

function SectionHeader({ title, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-slate-200 font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  )
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for recipes"
        className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-4"
        style={{ boxShadow: `0 0 0 0 ${theme.ring}` }}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.8-3.8"/></svg>
      </div>
    </div>
  )
}

function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 rounded-lg text-sm transition font-medium ${
            value === t
              ? 'bg-white/10 text-white shadow-inner'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function Quantity({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button className="px-3 py-2" onClick={() => onChange(Math.max(0, value - 1))}>-</button>
      <div className="px-3 py-2 min-w-[2.5rem] text-center">{value}</div>
      <button className="px-3 py-2" onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}

// --- Cards ---------------------------------------------------------------
function RecipeCard({ recipe, onClick }) {
  return (
    <button onClick={onClick} className="group w-full text-left">
      <div className="relative overflow-hidden rounded-2xl bg-black aspect-[4/3]">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute top-3 right-3">
          <IconButton className="backdrop-blur bg-black/40 border-black/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white"><path d="M5 21l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"/></svg>
          </IconButton>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <Pill className="bg-black/40 border-black/30 text-white">{recipe.category}</Pill>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-100 font-semibold truncate">{recipe.title}</h3>
          <Pill className="ml-2 text-amber-400 border-amber-400/20 bg-amber-400/10">{recipe.time} min</Pill>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <RatingStars value={recipe.rating} />
          <span className="text-xs text-slate-400">{recipe.calories} cal</span>
        </div>
      </div>
    </button>
  )
}

function CategoryCard({ cat, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(cat.name)}
      className={`relative overflow-hidden rounded-2xl aspect-square text-left border ${selected ? 'border-orange-500/50' : 'border-white/10'} bg-white/5 hover:bg-white/10 transition`}
    >
      <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
        <span className="text-white font-medium drop-shadow-md">{cat.name}</span>
        <span className={`w-2 h-2 rounded-full ${selected ? 'bg-orange-500' : 'bg-white/40'}`} />
      </div>
    </button>
  )
}

// --- Detail Page ---------------------------------------------------------
function RecipeDetail({ recipe, onBack, onShop }) {
  return (
    <div>
      <header className="sticky top-0 z-30 bg-[#0B0F14]/70 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <IconButton aria-label="back" onClick={onBack} className="bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 19l-7-7 7-7"/></svg>
          </IconButton>
          <h1 className="text-white font-semibold">{recipe.title}</h1>
          <div className="flex-1" />
          <IconButton>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"/></svg>
          </IconButton>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mt-5 rounded-3xl overflow-hidden border border-white/10">
          <div className="relative aspect-[16/10]">
            <img src={recipe.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
            <Pill className="absolute bottom-3 left-3 bg-black/40 border-black/30 text-white">{recipe.category}</Pill>
          </div>
          <div className="bg-[#12161B] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-white text-xl font-semibold">{recipe.title}</h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-300">
                  <RatingStars value={recipe.rating} />
                  <span>{recipe.calories} cal</span>
                  <span>{recipe.time} min</span>
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium text-black" style={{ background: theme.primary }}>Cook this</button>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-slate-200 font-medium">Ingredients</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20 inline-block" /> {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium">Steps</h3>
                <ol className="mt-3 space-y-3 text-sm text-slate-300 list-decimal pl-5 marker:text-slate-500">
                  {recipe.steps.map((s, i) => (
                    <li key={i} className="leading-relaxed">{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <IconButton className="bg-white/10 border-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h18M6 12h12M10 17h4"/></svg>
              </IconButton>
              <button onClick={onShop} className="px-4 py-2 rounded-xl font-medium border border-white/10 bg-white/5 text-slate-200">Shop ingredients</button>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </div>
  )
}

// --- Shop Ingredients Page ----------------------------------------------
function ShopIngredients({ recipe, onBack, onAddAll }) {
  const stores = ['Local Market', 'Fresh&Co', 'BudgetGrocer']
  const [store, setStore] = useState(stores[0])
  const [items, setItems] = useState(
    recipe.ingredients.map((label) => ({ label, qty: 1, checked: true, image: foodImageFor(label) }))
  )

  function priceFor(label) {
    const base = 1 + (label.length % 5)
    return parseFloat((base * 0.79).toFixed(2))
  }

  const subtotal = items.reduce((sum, it) => sum + (it.checked ? priceFor(it.label) * it.qty : 0), 0)

  function setQty(i, qty) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, qty } : it))
  }
  function toggle(i) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, checked: !it.checked } : it))
  }

  const selected = items.filter((i) => i.checked)

  return (
    <div>
      <header className="sticky top-0 z-30 bg-[#0B0F14]/70 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <IconButton aria-label="back" onClick={onBack} className="bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 19l-7-7 7-7"/></svg>
          </IconButton>
          <h1 className="text-white font-semibold">Shop ingredients</h1>
          <div className="flex-1" />
          <Pill className="text-white/80 border-white/10 bg-white/5">{store}</Pill>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mt-5 grid md:grid-cols-[2fr,1fr] gap-6">
          <div className="rounded-3xl border border-white/10 bg-[#12161B] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{recipe.title}</h2>
              <div className="flex gap-2">
                {stores.map((s) => (
                  <button key={s} onClick={() => setStore(s)} className={`px-3 py-1 rounded-lg text-sm border ${store===s?'border-orange-500/40 bg-orange-500/10 text-orange-300':'border-white/10 bg-white/5 text-slate-300'}`}>{s}</button>
                ))}
              </div>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {items.map((it, i) => (
                <li key={i} className="py-3 flex items-center gap-3">
                  <input type="checkbox" checked={it.checked} onChange={() => toggle(i)} className="accent-orange-500 w-4 h-4" />
                  <img src={it.image} alt="icon" className="w-9 h-9 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-slate-200 text-sm">{it.label}</div>
                    <div className="text-xs text-slate-400">€{priceFor(it.label).toFixed(2)} each</div>
                  </div>
                  <Quantity value={it.qty} onChange={(v) => setQty(i, v)} />
                  <div className="w-20 text-right text-slate-200">€{(priceFor(it.label)*it.qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-3">
              <IconButton className="bg-white/10 border-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h18M6 12h12M10 17h4"/></svg>
              </IconButton>
              <button onClick={() => onAddAll(selected)} className="px-4 py-2 rounded-xl font-medium border border-white/10 bg-white/5 text-slate-200">Add all to Shopping List</button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#12161B] p-5 h-fit">
            <h3 className="text-white font-semibold">Order summary</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Items subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-slate-300">
              <span>Delivery</span>
              <span>€{(subtotal>0?2.49:0).toFixed(2)}</span>
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between text-slate-100 font-semibold">
              <span>Total</span>
              <span>€{(subtotal + (subtotal>0?2.49:0)).toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full py-3 rounded-xl font-semibold text-black" style={{ background: theme.primary }}>Checkout</button>
            <button className="mt-2 w-full py-3 rounded-xl font-medium border border-white/10 bg-white/5 text-slate-200">Get store directions</button>
          </aside>
        </div>

        <div className="h-16" />
      </div>
    </div>
  )
}

// --- Shopping List Page --------------------------------------------------
function ShoppingList({ items, onBack, onRemoveAll, onToggleItem }) {
  return (
    <div>
      <header className="sticky top-0 z-30 bg-[#0B0F14]/70 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <IconButton aria-label="back" onClick={onBack} className="bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 19l-7-7 7-7"/></svg>
          </IconButton>
          <h1 className="text-white font-semibold">Shopping List</h1>
          <div className="flex-1" />
          <Pill className="text-white/80 border-white/10 bg-white/5">{items.length} items</Pill>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#12161B] p-5">
          <ul className="divide-y divide-white/5">
            {items.length === 0 && (
              <li className="py-6 text-center text-slate-400">Your list is empty. Add from a recipe.</li>
            )}
            {items.map((it, i) => (
              <li key={`${it.label}-${i}`} className="py-3 flex items-center gap-3 cursor-pointer" onClick={() => onToggleItem(i)}>
                <img src={it.image} alt="icon" className={`w-10 h-10 rounded-xl object-cover ${it.done ? 'opacity-40 grayscale' : ''}`} />
                <div className="flex-1">
                  <div className={`text-slate-200 text-sm ${it.done ? 'line-through text-slate-500' : ''}`}>{it.label}</div>
                  {it.qty > 1 && <div className="text-xs text-slate-400">Qty {it.qty}</div>}
                </div>
                {it.done && <span className="text-xs text-slate-400">tap to undo</span>}
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className="mt-4 flex gap-3">
              <button onClick={onRemoveAll} className="px-4 py-2 rounded-xl font-medium border border-white/10 bg-white/5 text-slate-200">Clear checked</button>
            </div>
          )}
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}

// --- Demo Data -----------------------------------------------------------
const demoRecipes = [
  {
    id: 'r1',
    title: 'Tangerines Pancake',
    image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?q=80&w=1600&auto=format&fit=crop',
    time: 25,
    calories: 280,
    rating: 4.7,
    servings: 2,
    category: 'Breakfast',
    ingredients: [
      '1 cup cane sugar',
      '1/2 cup extra-virgin olive oil',
      '3 large eggs (room temperature)',
      '1/2 cup ricotta',
      'Zest of 1 tangerine',
    ],
    steps: [
      'Whisk sugar and oil in a bowl until glossy.',
      'Beat in eggs one at a time, then fold in ricotta and zest.',
      'Pour batter onto a hot buttered pan and cook until bubbles form; flip and finish.',
      'Serve warm with slices of fresh tangerine.'
    ],
  },
  {
    id: 'r2',
    title: 'Quick Garlic Shrimp',
    image: 'https://images.unsplash.com/photo-1546549039-49fe37f3b6b2?q=80&w=1600&auto=format&fit=crop',
    time: 15,
    calories: 190,
    rating: 4.5,
    servings: 2,
    category: 'Quick n’ Easy',
    ingredients: [
      '300g shrimp, peeled',
      '2 tbsp olive oil',
      '3 cloves garlic, minced',
      '1/2 tsp chili flakes',
      'Salt & pepper',
      'Lemon wedges'
    ],
    steps: [
      'Heat oil in a skillet; add garlic and chili for 30 sec.',
      'Add shrimp, season, and cook 1–2 min per side.',
      'Finish with lemon juice and serve.'
    ],
  },
  {
    id: 'r3',
    title: 'Smash Burger Deluxe',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop',
    time: 30,
    calories: 520,
    rating: 4.8,
    servings: 1,
    category: 'Cuisines',
    ingredients: [
      '150g ground beef',
      '1 potato bun',
      '1 slice cheddar',
      'Pickles, onions, burger sauce'
    ],
    steps: [
      'Toast bun; heat cast-iron pan very hot.',
      'Press a ball of beef onto pan, season, and sear hard.',
      'Flip, add cheese, stack in bun with toppings.'
    ],
  },
  {
    id: 'r4',
    title: 'Green Goddess Salad',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1600&auto=format&fit=crop',
    time: 12,
    calories: 160,
    rating: 4.3,
    servings: 2,
    category: 'Diets',
    ingredients: [
      '2 cups chopped lettuce',
      '1 avocado, diced',
      '1/2 cup cucumber, diced',
      'Herby yogurt dressing'
    ],
    steps: [
      'Toss veg with dressing until coated.',
      'Season and serve immediately.'
    ],
  },
]

const demoCategories = [
  { name: 'Guided', image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32a?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Quick n’ Easy', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Cuisines', image: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Diets', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Ingredients', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Seasonal', image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=1200&auto=format&fit=crop' }
]

// --- Layout Blocks -------------------------------------------------------
function Header({ onBack, onOpenList, listCount }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-[#0B0F14]/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        {onBack ? (
          <IconButton aria-label="back" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 19l-7-7 7-7"/></svg>
          </IconButton>
        ) : (
          <span className="text-orange-400 font-black text-xl tracking-tight">Yummy</span>
        )}
        <div className="flex-1" />
        <IconButton aria-label="open shopping list" onClick={onOpenList} className="relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4"/><circle cx="7" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
          {listCount>0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{listCount}</span>}
        </IconButton>
      </div>
    </header>
  )
}

function BottomNav({ onExplore, onList, active }) {
  const items = [
    { key:'explore', label: 'Home', icon: (<path d="M3 12l9-9 9 9v8a2 2 0 01-2 2h-5v-6H10v6H5a2 2 0 01-2-2z" />), onClick:onExplore },
    { key:'search', label: 'Search', icon: (<><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.8-3.8"/></>) },
    { key:'list', label: 'List', icon: (<><path d="M3 6h18M3 12h18M3 18h18"/></>), onClick:onList },
    { key:'profile', label: 'Profile', icon: (<><path d="M12 12a5 5 0 100-10 5 5 0 000 10z"/><path d="M4 22a8 8 0 0116 0"/></>) },
  ]
  return (
    <nav className="sticky bottom-0 z-20 border-t border-white/5 bg-[#0B0F14]/70 backdrop-blur">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-2 px-4 py-3">
        {items.map((it) => (
          <button key={it.label} onClick={it.onClick} className={`flex flex-col items-center gap-1 ${active===it.key?'text-white':'text-slate-300 hover:text-white'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{it.icon}</svg>
            <span className="text-xs">{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// --- Main Page -----------------------------------------------------------
function ExplorePage({ query, setQuery, tab, setTab, selectedCats, setSelectedCats, onOpenRecipe, onShopFromFeatured }) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return demoRecipes.filter(r =>
      (!q || r.title.toLowerCase().includes(q)) &&
      (selectedCats.length === 0 || selectedCats.includes(r.category))
    )
  }, [query, selectedCats])

  function toggleCat(name) {
    setSelectedCats((arr) => arr.includes(name) ? arr.filter(n => n !== name) : [...arr, name])
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-4">
        <div className="py-6 md:py-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-100">What do you want to cook today?</h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
            <SearchBar value={query} onChange={setQuery} />
            <Tabs tabs={["Just for you", "Explore", "Pro"]} value={tab} onChange={setTab} />
          </div>
        </div>

        <SectionHeader title="Browse by category" className="mt-2" />
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {demoCategories.map((c) => (
            <CategoryCard key={c.name} cat={c} selected={selectedCats.includes(c.name)} onToggle={toggleCat} />
          ))}
        </div>

        <SectionHeader
          title={<div className="flex items-center gap-4"><span>Newest Foods</span><span className="text-slate-500">Best Recipes</span><span className="text-slate-500">Popular</span></div>}
          action={<button className="text-sm text-orange-400 hover:underline">See all</button>}
          className="mt-8"
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} onClick={() => onOpenRecipe(r)} />
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#12161B] p-3 md:p-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
              <img src={demoRecipes[0].image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
              <IconButton className="absolute top-3 right-3 bg-black/40 border-black/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white"><path d="M5 21l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"/></svg>
              </IconButton>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{demoRecipes[0].title}</h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex items-center gap-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 8v4l3 3"/></svg>{demoRecipes[0].time} minutes</span>
                  <span>{demoRecipes[0].calories} calories</span>
                </div>
              </div>
              <button onClick={() => onShopFromFeatured(demoRecipes[0])} className="px-4 py-2 rounded-xl font-medium text-black" style={{ background: theme.primary }}>Shop ingredients</button>
            </div>

            <div className="mt-5">
              <h4 className="text-slate-300 font-medium">Ingredients</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20 inline-block" /> 1 cup cane sugar</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20 inline-block" /> 1/2 cup extra-virgin olive oil</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20 inline-block" /> 3 large eggs (room temp)</li>
                <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20 inline-block" /> 1/2 cup ricotta</li>
              </ul>

              <div className="mt-4 flex items-center gap-3">
                <IconButton className="bg-white/10 border-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h18M6 12h12M10 17h4"/></svg>
                </IconButton>
                <button onClick={() => onShopFromFeatured(demoRecipes[0])} className="px-4 py-2 rounded-xl font-medium border border-white/10 bg-white/5 text-slate-200">Shop ingredients</button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#12161B] p-5 flex flex-col justify-center">
            <h3 className="text-white text-lg font-semibold">Pro tips</h3>
            <p className="mt-2 text-slate-300 text-sm">Heat your pan well before the batter hits the surface, and don’t flip too early. A little butter for browning goes a long way.</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Pill className="text-amber-400 border-amber-400/20 bg-amber-400/10">Citrus</Pill>
              <Pill>Ricotta</Pill>
              <Pill>Breakfast</Pill>
              <Pill>Sweet</Pill>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </main>
    </>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('Explore')
  const [selectedCats, setSelectedCats] = useState(['Quick n’ Easy'])
  const [activeId, setActiveId] = useState(null)
  const [page, setPage] = useState('explore')
  const [list, setList] = useState([])

  const activeRecipe = useMemo(() => demoRecipes.find(r => r.id === activeId) || null, [activeId])

  function openDetail(r){ setActiveId(r.id); setPage('detail') }
  function openShop(r){ setActiveId(r.id); setPage('shop') }

  function addAllToList(items){
    setList((prev)=>{
      const copy = [...prev]
      for(const it of items){
        const existing = copy.find(x => slug(x.label) === slug(it.label))
        if(existing){ existing.qty += it.qty || 1; existing.done = false }
        else { copy.push({ label: it.label, qty: it.qty || 1, image: it.image || foodImageFor(it.label), done:false }) }
      }
      return copy
    })
    setPage('list')
  }

  function toggleListItem(idx){
    setList((arr)=> arr.map((it,i)=> i===idx? { ...it, done: !it.done } : it))
  }

  function clearChecked(){
    setList((arr)=> arr.filter((it)=> !it.done))
  }

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(1200px 600px at 20% -10%, #121821 0%, #0B0F14 60%)` }}>
      {page !== 'explore' ? (
        <Header onBack={() => setPage(page==='detail'?'explore': page==='shop'?'detail':'explore')} onOpenList={()=>setPage('list')} listCount={list.length} />
      ) : (
        <Header onOpenList={()=>setPage('list')} listCount={list.length} />
      )}

      {page === 'explore' && (
        <ExplorePage
          query={query}
          setQuery={setQuery}
          tab={tab}
          setTab={setTab}
          selectedCats={selectedCats}
          setSelectedCats={setSelectedCats}
          onOpenRecipe={openDetail}
          onShopFromFeatured={openShop}
        />
      )}

      {page === 'detail' && activeRecipe && (
        <RecipeDetail recipe={activeRecipe} onBack={() => setPage('explore')} onShop={() => openShop(activeRecipe)} />
      )}

      {page === 'shop' && activeRecipe && (
        <ShopIngredients recipe={activeRecipe} onBack={() => setPage('detail')} onAddAll={addAllToList} />
      )}

      {page === 'list' && (
        <ShoppingList items={list} onBack={() => setPage('explore')} onRemoveAll={clearChecked} onToggleItem={toggleListItem} />
      )}

      <BottomNav onExplore={()=>setPage('explore')} onList={()=>setPage('list')} active={page==='list'?'list':'explore'} />
    </div>
  )
}
