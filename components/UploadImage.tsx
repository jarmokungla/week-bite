'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

// simple local uuid implementation if uuid is not installed
function simpleId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function UploadImage({ onUploaded }:{ onUploaded:(url:string)=>void }) {
  const [uploading, setUploading] = useState(false);
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const user = (await supabaseBrowser.auth.getUser()).data.user;
    if (!user) { setUploading(false); return; }
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${simpleId()}.${ext}`;
    const { data, error } = await supabaseBrowser.storage.from('recipe-images').upload(path, file);
    setUploading(false);
    if (error) { alert(error.message); return; }
    const { data: { publicUrl } } = supabaseBrowser.storage.from('recipe-images').getPublicUrl(path);
    onUploaded(publicUrl);
  }
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="px-3 py-2 border border-primary/25 bg-surface rounded-xl">{uploading ? 'Uploading...' : 'Upload image'}</span>
      <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
    </label>
  )
}
