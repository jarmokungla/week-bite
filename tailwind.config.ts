import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // mint
        primaryDark: '#0F766E', // deep teal
        accent: '#0EA5E9', // sky
        bg: '#0B1220', // midnight
        text: '#ECFEFF', // mint-ice text on dark
        muted: '#A7F3D0', // mint-ice
        ring: 'rgba(16,185,129,0.25)',
      }
    },
  },
  plugins: [],
}
export default config
