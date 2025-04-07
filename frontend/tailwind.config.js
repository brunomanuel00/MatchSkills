/** @type {import('tailwindcss').Config} */

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				lapis_lazuli: {
					DEFAULT: "#22577a",
					100: "#071219",
					200: "#0e2331",
					300: "#15354a",
					400: "#1c4663",
					500: "#22577a",
					600: "#327fb2",
					700: "#5aa1d1",
					800: "#91c1e0",
					900: "#c8e0f0",
				},
				verdigris: {
					DEFAULT: "#38a3a5",
					100: "#0b2021",
					200: "#164141",
					300: "#226162",
					400: "#2d8183",
					500: "#38a3a5",
					600: "#52c2c4",
					700: "#7dd1d3",
					800: "#a8e0e1",
					900: "#d4f0f0",
				},
				emerald: {
					DEFAULT: "#57cc99",
					100: "#0e2c1f",
					200: "#1b593e",
					300: "#29855d",
					400: "#37b27c",
					500: "#57cc99",
					600: "#79d6ad",
					700: "#9ae0c2",
					800: "#bcead6",
					900: "#ddf5eb",
				},
				light_green: {
					DEFAULT: "#80ed99",
					100: "#094016",
					200: "#12812c",
					300: "#1cc142",
					400: "#42e468",
					500: "#80ed99",
					600: "#9bf1af",
					700: "#b4f4c3",
					800: "#cdf8d7",
					900: "#e6fbeb",
				},
				tea_green: {
					DEFAULT: "#c7f9cc",
					100: "#095110",
					200: "#11a220",
					300: "#25e839",
					400: "#76f183",
					500: "#c7f9cc",
					600: "#d3fad7",
					700: "#defce1",
					800: "#e9fdeb",
					900: "#f4fef5",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [("tailwindcss-animate")],
}

