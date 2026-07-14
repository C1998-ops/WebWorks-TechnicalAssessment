/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			primary: ['Proxima Nova', 'sans-serif'],
			secondary: ['Source Sans Pro', 'sans-serif'],
			serif: ['Georgia', 'serif'],
		},
		extend: {
			colors: {
				primary: {
					navy: '#00276B',
					mint: '#86C5BC',
					orange: '#F59E1B',
					yellow: '#FFBF3F',
					red: '#CA4827',
				},
				secondary: {
					teal: '#244E5A',
					burgundy: '#931E42',
					rust: '#CA471C',
					cream: '#F7E5D4',
					gold: '#F89C22',
					purple: '#6374EA',
					'green-100': '#85C7BA1A',
					'green-200': '#85C7BA4D',
					'green-300': '#007C64',
					'green-400': '#4E89791A',
					'green-500': '#85C7BA',
          'green-600': '#CAFFF5',
          'green-700': '#F3F9F8',
					'red-100': '#F4E8EC',
					'red-200': '#931E4233',
					'red-300': '#931E42',
					'blue-100': '#3571881A',
					'blue-200': '#357188',
					'blue-300': '#2A5A6B',
					'orange-100': '#CA48271A',
					'orange-200': '#CA4827',
					'orange-300': '#FFECD4',
					'yellow-100': '#F89C221A',
					'yellow-200': '#FDBD3E',
					'yellow-300': '#FDBD3E1A',
					'purple-100': '#6374EA1A',
					'purple-200': '#CFD5FC',
					'purple-300': '#99A6FF',
					'purple-400': '#E5E8FF',
					'light-silver': '#6374EA0D',
					'purple-500': '#F6F6F6',
				},
				neutral: {
					white: '#FAFAFA',
					dark: '#434343',
					light: '#F7F8FE',
					grey: '#B3B3B3',
					textGrey: '#838C9C',
					'light-grey': '#E5E7EB',
					'dark-grey': '#444444',
					borderGrey: '#BABABA',
					greyedOut: '#DBDBDB',
					lightBorder: '#EAECF0',
					'grey-100': '#CFCFCF',
					'grey-200': '#A8A8A8',
					'navy-light': '#D7E4FF',
					'orange-light': '#FFEED7',
				},
			},
			fontSize: {
				huge: [
					'4rem',
					{
						lineHeight: '1.2',
						fontWeight: '700',
						letterSpacing: '-0.02em',
					},
				],
				h1: [
					'3rem',
					{
						lineHeight: '1.2',
						fontWeight: '700',
						letterSpacing: '-0.02em',
					},
				],
				h2: [
					'2.5rem',
					{
						lineHeight: '1.2',
						fontWeight: '700',
						letterSpacing: '-0.02em',
					},
				],
				h3: [
					'1.75rem',
					{
						lineHeight: '1.2',
						fontWeight: '700',
						letterSpacing: '-0.01em',
					},
				],
				h4: [
					'1.5rem',
					{
						lineHeight: '1.2',
						fontWeight: '700',
						letterSpacing: '-0.01em',
					},
				],
				'subheading-1': [
					'1.75rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'subheading-2': [
					'1.5rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'subheading-3': [
					'1.25rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'subheading-4': [
					'1.125rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'subheading-5': [
					'1rem',
					{
						lineHeight: '1.375',
						fontWeight: '700',
					},
				],
				body: [
					'1rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'body-bold': [
					'1rem',
					{
						lineHeight: '1.5',
						fontWeight: '700',
					},
				],
				label: [
					'0.875rem',
					{
						lineHeight: '1.5',
						fontWeight: '700',
					},
				],
				small: [
					'0.75rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
				'small-bold': [
					'0.75rem',
					{
						lineHeight: '1.5',
						fontWeight: '700',
					},
				],
				medium: [
					'1rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				],
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				slideOut: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
			},
			animation: {
				slideIn: 'slideIn 0.3s ease-out',
				slideOut: 'slideOut 0.3s ease-out',
			},
			fontFamily: {
				primary: ['Proxima Nova', 'sans-serif'],
				secondary: ['Source Sans Pro', 'sans-serif'],
			},
			boxShadow: {
				purple: '0px 0px 18px 0px theme(colors.secondary.purple)',
				dark: '0px 0px 20px 0px #00000040',
				small: '0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
        medium: '0px 0px 12px 0px #0000001A',
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities(
				{
					'.no-scrollbar::-webkit-scrollbar': {
						display: 'none',
					},
					'.no-scrollbar': {
						'-ms-overflow-style': 'none',
						'scrollbar-width': 'none',
					},
					'.text-primary-medium': {
						//for label of fields
						fontSize: '16px',
						lineHeight: '1.5',
						fontWeight: '400',
						fontFamily: '"Proxima Nova", sans-serif',
					},
				},
				['responsive'] // ✅ enables sm:, md:, lg: etc.
			);
		},
	],
};
