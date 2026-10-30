/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { brand: { 50: "#eef6ff", 100: "#d9eaff", 500: "#2878d0", 600: "#1e63b4", 700: "#1b4f8d" } },
    boxShadow: { soft: "0 10px 35px rgba(15, 23, 42, .06)" }
  }},
  plugins: []
};