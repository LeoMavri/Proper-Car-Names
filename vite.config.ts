import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Proper Car Names",
        description:
          "Who the fuck likes the new names? (except the tribute ones)",
        author: "mavri [2402357]",
        namespace: "diicot",
        match: ["www.torn.com/loader.php?sid=racing"],
        updateURL:
          "https://github.com/LeoMavri/Proper-Car-Names/raw/main/dist/proper-car-names.user.js",
        downloadURL:
          "https://github.com/LeoMavri/Proper-Car-Names/raw/main/dist/proper-car-names.user.js",
      },
    }),
  ],
  build: {
    minify: true,
  },
});
