/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#283618',   // Black Forest
                    secondary: '#606c38', // Olive Leaf
                    accent: '#bc6c25',    // Copperwood
                    highlight: '#dda15e', // Sunlit Clay
                    bg: '#fefae0',        // Cornsilk
                    text: '#283618',      // Black Forest (for deep text contrast)
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            }
        },
    },
    plugins: [],
}
