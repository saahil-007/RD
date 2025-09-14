import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        heritage: {
          DEFAULT: "hsl(var(--heritage))",
          foreground: "hsl(var(--heritage-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-sunset': 'var(--gradient-sunset)',
        'gradient-heritage': 'var(--gradient-heritage)',
        'gradient-mandala': 'var(--gradient-mandala)',
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'heritage': 'var(--shadow-heritage)',
        'glow': 'var(--shadow-glow)',
        'mandala': 'var(--shadow-mandala)',
      },
      transitionTimingFunction: {
        'smooth': 'var(--transition-smooth)',
        'heritage': 'var(--transition-heritage)',
        'mandala': 'var(--transition-mandala)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "mandala-float": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "25%": { transform: "translate(10px, -15px) rotate(90deg) scale(1.05)" },
          "50%": { transform: "translate(-5px, -10px) rotate(180deg) scale(0.95)" },
          "75%": { transform: "translate(-15px, 5px) rotate(270deg) scale(1.02)" },
        },
        "mandala-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "heritage-glow": {
          "0%": { boxShadow: "var(--shadow-heritage)" },
          "100%": { boxShadow: "var(--shadow-glow)" },
        },
        "lotus-bloom": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "0.7" },
          "50%": { transform: "scale(1.1) rotate(180deg)", opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "mandala-float": "mandala-float 20s ease-in-out infinite",
        "mandala-rotate": "mandala-rotate 30s linear infinite",
        "heritage-glow": "heritage-glow 3s ease-in-out infinite alternate",
        "lotus-bloom": "lotus-bloom 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
