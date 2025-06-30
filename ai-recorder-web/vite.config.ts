import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    allowedHosts: ['ngrok-free.app', '5355-2406-5900-902b-7c10-d416-d7dd-932-fa15.ngrok-free.app'],
  },
});
