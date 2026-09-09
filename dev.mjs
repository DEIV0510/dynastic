// Arranca Vite en proceso: evita depender del shell/PATH en Windows.
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

process.chdir(dirname(fileURLToPath(import.meta.url)));

const server = await createServer({
  server: { port: Number(process.env.PORT) || 5329, strictPort: false },
});
await server.listen();
server.printUrls();
