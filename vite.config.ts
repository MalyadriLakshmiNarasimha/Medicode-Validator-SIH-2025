import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
<<<<<<< HEAD

  server: {
    watch: {
      // Exclude backend virtual environment directory from file watching
      ignored: ['**/backend/venv/**']
    }
  }
=======
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
});
