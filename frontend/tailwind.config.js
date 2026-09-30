export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
