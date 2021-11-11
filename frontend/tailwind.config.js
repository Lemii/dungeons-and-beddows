module.exports = {
	enabled: true,
	// mode: 'jit',
	// purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	// darkMode: false,
	theme: {
		fontFamily: {
			sans: ['minecraft', 'Helvetica', 'Arial', 'sans-serif'],
			mono: ['minecraft', 'Helvetica', 'Arial', 'sans-serif'],
		},
		minHeight: {
			0: '0',
			'1/4': '25%',
			'1/2': '50%',
			'3/4': '75%',
			full: '100%',
			test: '90vw',
		},
		maxHeight: {
			0: '0',
			'1/4': '25%',
			'1/2': '50%',
			'3/4': '75%',
			full: '100%',
			test: '90vw',
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
