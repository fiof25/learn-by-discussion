import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCharacterPrompt(name) {
    const fileName = name === 'jamie' ? 'JAMIE_BEAVER_V2.md' : 'THOMAS_GOOSE_V2.md';
    const filePath = path.join(__dirname, '..', 'characters', fileName);
    return fs.readFileSync(filePath, 'utf8');
}

export const COLLABORATIVE_SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '..', 'characters', 'COLLABORATIVE_SYSTEM_PROMPT.md'), 'utf8');
export const JAMIE_PROMPT = getCharacterPrompt('jamie');
export const THOMAS_PROMPT = getCharacterPrompt('thomas');
