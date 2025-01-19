/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        poppins: ['poppins', 'sans-serif'],
        PoppinsL: ['poppinsl','sans-serif'],  // Add your custom font here
      },
  	}
  },
  plugins: [require('daisyui')],
};
