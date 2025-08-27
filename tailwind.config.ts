import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        primaryDark: '#1e40af',
        accent: '#f59e0b',
        bg: '#1c1c1e',
        surface: '#ffffff',
        text: '#e5e7eb',
        headline: '#111827',
        muted: '#6b7280',
        ring: 'rgba(37,99,235,0.25)',
        success: '#22C55E'
      }
    },
  },
  plugins: [],
}
export default config
