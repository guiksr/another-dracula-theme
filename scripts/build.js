const fs = require('fs');
const path = require('path');
const generate = require('./generate');

const THEME_DIR = path.join(__dirname, '..', 'theme');

if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR);
}

module.exports = async () => {
    const { base, alucard } = await generate();

    return Promise.all([
        fs.promises.writeFile(
            path.join(THEME_DIR, 'dracula.json'),
            JSON.stringify(base, null, 4)
        ),
        fs.promises.writeFile(
            path.join(THEME_DIR, 'alucard.json'),
            JSON.stringify(alucard, null, 4)
        ),
    ]);
};

if (require.main === module) {
    module.exports();
}
