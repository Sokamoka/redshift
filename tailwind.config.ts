import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto, sans-serif"],
      },
      gridTemplateRows: {
        'mincontent': 'min-content'
      }
    },
  },
};
