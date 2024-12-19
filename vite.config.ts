import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        'background': 'src/main.ts',
        'content': 'src/content.ts'
      },
      output: {
        entryFileNames: '[name].js',
        format: 'commonjs'
      }
    },
  }
})
