import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://edu-smart.runasp.net',
//         changeOrigin: true,
//         secure: false,
//         // شيل rewrite أو خليه يرجّع نفس المسار
//         rewrite: (path) => path, // <-- هنا التعديل
//       }
//     }
//   }
// })
