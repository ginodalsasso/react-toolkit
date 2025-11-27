import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const __registryPath = join(__dirname, '../../registry');

export const __configPath = join(process.cwd(), __filename);
export const __pkgJsonPath = join(process.cwd(), 'package.json');