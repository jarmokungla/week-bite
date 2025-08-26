'use client';
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      phone,
      options: { channel: 'sms', shouldCreateUser: true }
    });
    if (error) { setErr(error.message); }
    else { setStep('code'); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabaseBrowser.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms'
    });
    const data = await supabaseBrowser.auth.getUser();
    if (error) { setErr(error.message); }
    else { router.push('/'); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login with phone</h1>
      {step === 'phone' && (
        <form onSubmit={sendCode} className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="+3725123456"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl bg-primary text-white">Send code</button>
        </form>
      )}
      {step === 'code' && (
        <form onSubmit={verify} className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl bg-primary text-white">Verify</button>
        </form>
      )}
      {err && <p className="text-red-600 mt-3">{err}</p>}
      <p className="text-sm text-muted mt-4">SMS must be enabled in your Supabase project.</p>
    </div>
  )
}
