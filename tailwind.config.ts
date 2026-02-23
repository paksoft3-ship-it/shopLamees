import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: '#b18d59',
					foreground: '#ffffff',
					dark: '#8f6e40'
				},
				surface: '#ffffff',
				'on-surface': '#111111',
				'background-light': '#fbf7f2',
				'background-dark': '#1d1a15',
				subtle: '#837563',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				'accent-amber': '#F59E0B',
				'accent-blue': '#3B82F6',
				'accent-green': '#10B981',
				'accent-red': '#EF4444',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				display: ['var(--font-noto-kufi)', 'var(--font-noto-sans-arabic)', 'var(--font-inter)', 'sans-serif'],
				body: ['var(--font-cairo)', 'var(--font-manrope)', 'var(--font-inter)', 'sans-serif'],
				code: ['var(--font-inter)', 'monospace'],
			},
			borderRadius: {
				lg: '1rem',
				md: 'calc(1rem - 2px)',
				sm: 'calc(1rem - 4px)',
				DEFAULT: '0.5rem',
				xl: '1.5rem',
				'2xl': '2rem',
				full: '9999px'
			},
			boxShadow: {
				soft: '0 4px 20px -2px rgba(177, 141, 89, 0.1)',
				card: '0 2px 8px -2px rgba(0, 0, 0, 0.05)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries")
	],
};
export default config;
