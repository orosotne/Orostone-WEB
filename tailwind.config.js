/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    // hover: styles only on devices that can hover — on touch screens a tap must not leave a card lifted
    future: {
      hoverOnlyWhenSupported: true,
    },
    content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Montserrat',
  				'Montserrat Fallback',
  				'sans-serif'
  			]
  		},
  		colors: {
  			brand: {
  				gold: '#ECD488',
  				dark: '#1A1A1A',
  				light: '#F9F9F7',
  				gray: '#F5F5F0',
  				stone: '#2A2A2A',
  				// New design system (2026-10)
  				sand: '#EFEDE6',
  				muted: '#5F5E5A',
  				line: '#E2E0D8',
  				'gold-hover': '#F3E2A6'
  			},
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
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			orostone: '1rem'
  		},
  		// New design system (2026-10): content grid and type scale, see STYLE_GUIDE.md
  		maxWidth: {
  			os: '1800px'
  		},
  		fontSize: {
  			'os-h1': ['clamp(1.95rem, 2.7vw, 3.1rem)', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '600' }],
  			'os-h2': ['clamp(1.7rem, 2.2vw, 2.3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
  			'os-h3': ['clamp(1.2rem, 1.6vw, 1.45rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
  			'os-lead': ['clamp(1rem, 1.2vw, 1.13rem)', { lineHeight: '1.6' }],
  			'os-eyebrow': ['0.74rem', { lineHeight: '1.2', letterSpacing: '0.2em', fontWeight: '700' }]
  		},
  		backgroundImage: {
  			noise: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
  		},
  		animation: {
  			marquee: 'marquee 40s linear infinite',
  		},
  		keyframes: {
  			marquee: {
  				'0%': { transform: 'translateX(0)' },
  				'100%': { transform: 'translateX(-50%)' },
  			},
  		},
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
  ],
}
