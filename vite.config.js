import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    root: 'public',
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true
    }
});
