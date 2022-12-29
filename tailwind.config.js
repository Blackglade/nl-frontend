/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				bgColor: 'var(--bgColor)',
				borderBlack: 'var(--borderBlack)',
				darkerText: 'var(--darkerText)',
				lightText: 'var(--lightText)',
				accentLight: 'var(--accentLight)',
				accentDark: 'var(--accentDark)',
				success: 'var(--success)',
				error: 'var(--error)'
			},
			boxShadow: {
				'bottomAccent': 'var(--accentLight) 0 4px 0 0'
			},
			keyframes: {
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
			},
			animation: {
				'fade-in-up': 'fade-in-up 1s ease-out',
			},
		},
	},
	plugins: [],
}
