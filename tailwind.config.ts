import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003566',  // deep blue
        primaryDark: '#00274d',
        accent: '#ff4d6d',  // logo red
        bg: '#000814',  // very dark background
        surface: '#001d3d',  // navbar/cards
        text: '#cbd5e1',  // body on dark
        headline: '#e2e8f0',  // titles on dark
        muted: '#64748b',  // meta text
        ring: 'rgba(255,77,109,0.25)',
        success: '#16a34a'
      }
    },
  },
  plugins: [],
}
export default config
