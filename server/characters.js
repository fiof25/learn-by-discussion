const fs = require('fs');
const path = require('path');

function getCharacterPrompt(name) {
    const fileName = name === 'jamie' ? 'JAMIE_BEAVER_V2.md' : 'THOMAS_GOOSE_V2.md';
    const filePath = path.join(__dirname, '..', 'characters', fileName);
    return fs.readFileSync(filePath, 'utf8');
}

const COLLABORATIVE_SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '..', 'characters', 'COLLABORATIVE_SYSTEM_PROMPT.md'), 'utf8');

module.exports = {
    JAMIE_PROMPT: getCharacterPrompt('jamie'),
    THOMAS_PROMPT: getCharacterPrompt('thomas'),
    COLLABORATIVE_SYSTEM_PROMPT
};
