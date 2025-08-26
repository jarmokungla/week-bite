import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',  // mint
        primaryDark: '#0F766E',
        accent: '#38BDF8',  // brighter sky
        bg: '#0B1220',  // midnight
        surface: '#0F172A',  // cards/navbar
        text: '#C7EDE3',  // body on dark
        headline: '#ECFEFF',  // titles on dark
        muted: '#94A3B8',  // meta text
        ring: 'rgba(16,185,129,0.25)',
        success: '#22C55E'
      }
    },
  },
  plugins: [],
}
export default config
