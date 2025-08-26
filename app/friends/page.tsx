'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { createFriendByPhone, acceptFriend, shareBook } from '@/lib/actions';

export default function FriendsPage() {
  const [phone, setPhone] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  async function refresh() {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) return;
    const { data: outgoing } = await supabaseBrowser
      .from('friends_with_profiles')
      .select('*');
    setFriends(outgoing ?? []);
    const { data: myBooks } = await supabaseBrowser.from('recipe_books').select('*').eq('owner_id', user.id);
    setBooks(myBooks ?? []);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <div className="p-4 border border-primary/25 bg-surface rounded-2xl">
        <h2 className="font-medium mb-2 text-headline">Add a friend by phone</h2>
        <form action={async () => { await createFriendByPhone(phone); setPhone(''); }} className="flex gap-2">
          <input className="border border-primary/25 rounded-xl px-3 py-2 flex-1" placeholder="+372..." value={phone} onChange={e=>setPhone(e.target.value)} />
          <button className="px-3 py-2 rounded-xl bg-primary text-headline">Add</button>
        </form>
        <p className="text-sm text-muted mt-2">They will need to accept your request.</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-headline">Your Friends</h2>
        <div className="space-y-2">
          {friends.map((f:any) => (
            <div key={f.id} className="border border-primary/25 bg-surface rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-headline">{f.friend_display_name ?? f.friend_phone ?? f.friend_id}</div>
                <div className="text-sm text-muted">{f.status}</div>
              </div>
              {f.status === 'pending_me' && (
                <form action={acceptFriend.bind(null, f.friend_id)}>
                  <button className="text-sm px-3 py-1 rounded-xl border border-primary/25 bg-surface">Accept</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-headline">Share a Book</h2>
        {books.length === 0 && <p className="text-sm text-muted">Create a book by assigning one when adding a recipe (default is created automatically).</p>}
        <div className="grid md:grid-cols-2 gap-3">
          {books.map(b => (
            <ShareCard key={b.id} book={b} friends={friends.filter(f=>f.status==='accepted')} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ShareCard({ book, friends }:{ book:any, friends:any[] }) {
  const [selected, setSelected] = useState<string>('');
  return (
    <div className="border border-primary/25 bg-surface rounded-2xl p-3">
      <div className="font-medium mb-2 text-headline">{book.name}</div>
      <div className="flex gap-2">
        <select className="border border-primary/25 rounded-xl px-3 py-2 flex-1 bg-surface" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Choose friend…</option>
          {friends.map(f => <option key={f.friend_id} value={f.friend_id}>{f.friend_display_name ?? f.friend_phone ?? f.friend_id}</option>)}
        </select>
        <form action={async () => { if(!selected) return; await shareBook(book.id, selected, 'view'); }}>
          <button className="px-3 py-2 rounded-xl border border-primary/25 bg-surface">Share</button>
        </form>
      </div>
    </div>
  )
}
