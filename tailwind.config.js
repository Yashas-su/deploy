/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Core palette: black + white + indicators only
        primary:   '#000000',
        surface:   '#0a0a0a',
        card:      '#111111',
        border:    '#1f1f1f',
        muted:     '#2a2a2a',
        subtle:    '#3a3a3a',
        dimmed:    '#555555',
        label:     '#888888',
        soft:      '#bbbbbb',
        white:     '#ffffff',
        // Indicator colours only
        up:        '#22c55e',   // green  – increase / success
        down:      '#ef4444',   // red    – decrease / danger
        warn:      '#eab308',   // yellow – warning / pending
      },
    },
  },
  plugins: [],
}
