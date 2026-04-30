/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        bg: '#0f172a',
        'bg-card': '#1e293b',
        'bg-hover': '#334155',
        text: '#f1f5f9',
        'text-secondary': '#94a3b8',
        border: '#334155',
        success: '#10b981',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
