const { readFile } = require('fs').promises;
const { join } = require('path');
const { Type, DEFAULT_SCHEMA, load } = require('js-yaml');
const tinycolor = require('tinycolor2');

const withAlphaType = new Type('!alpha', {
    kind: 'sequence',
    construct: ([hexRGB, alpha]) => hexRGB + alpha,
    represent: ([hexRGB, alpha]) => hexRGB + alpha,
});

const schema = DEFAULT_SCHEMA.extend([withAlphaType]);

// const transformSoft = theme => {
//     const soft = JSON.parse(JSON.stringify(theme));
//     const brightColors = [...soft.dracula.ansi, ...soft.dracula.brightOther];

//     for (const key of Object.keys(soft.colors)) {
//         if (brightColors.includes(soft.colors[key])) {
//             soft.colors[key] = tinycolor(soft.colors[key])
//                 .desaturate(20)
//                 .toHexString();
//         }
//     }

//     soft.tokenColors = soft.tokenColors.map((value) => {
//         if (brightColors.includes(value.settings.foreground)) {
//             value.settings.foreground = tinycolor(value.settings.foreground).desaturate(20).toHexString();
//         }
//         return value;
//     })
//     return soft;
// };

const transformAlucard = theme => {
    const alucard = JSON.parse(JSON.stringify(theme));
    const uiColors = [...alucard.dracula.other.splice(4), alucard.dracula.base[0], alucard.dracula.base[1]];
    const base = [...alucard.dracula.base.splice(2)];
    console.log(alucard, uiColors);

    for (const key of Object.keys(alucard.colors)) {
        if (uiColors.includes(alucard.colors[key])) {
            alucard.colors[key] = tinycolor(alucard.colors[key])
                .darken(3)
                .toHexString();
        }
    }

    alucard.tokenColors = alucard.tokenColors.map((value) => {
        if (uiColors.includes(value.settings.foreground)) {
            value.settings.foreground = tinycolor(value.settings.foreground).darken(3).toHexString();
        }
        return value;
    })
    return alucard;
};

const transformDark = theme => {
    const dark = JSON.parse(JSON.stringify(theme));
    const uiColors = [...dark.dracula.other.slice(4), dark.dracula.base[0], dark.dracula.base[1]];
    const base = [...dark.dracula.base.slice(4)];
    console.log(dark, uiColors);

    for (const key of Object.keys(dark.colors)) {
        if (uiColors.includes(dark.colors[key])) {
            dark.colors[key] = tinycolor(dark.colors[key])
                .darken(5)
                .toHexString();
        } else if (base.includes(dark.colors[key])) {
            dark.colors[key] = tinycolor(dark.colors[key])
                .darken(2)
                .desaturate(20)
                .toHexString();
        }
    }

    dark.tokenColors = dark.tokenColors.map((value) => {
        if (base.includes(value.settings.foreground)) {
            value.settings.foreground = tinycolor(value.settings.foreground).darken(2).desaturate(20).toHexString();
        }
        return value;
    })
    return dark;
};

const transformDarker = theme => {
    const dark = JSON.parse(JSON.stringify(theme));
    const uiColors = [...dark.dracula.other.slice(4), dark.dracula.base[0], dark.dracula.base[1]];
    const base = [...dark.dracula.base.slice(4)];
    const fg = dark.dracula.base[1];
    const comment = dark.dracula.base[3];
    const syntax = [ ...base, fg, comment ]

    console.log(dark, uiColors);

    for (const key of Object.keys(dark.colors)) {
        if (uiColors.includes(dark.colors[key])) {
            dark.colors[key] = tinycolor(dark.colors[key])
                .darken(6)
                .toHexString();
        } else if (base.includes(dark.colors[key])) {
            dark.colors[key] = tinycolor(dark.colors[key])
                .darken(1)
                .desaturate(10)
                .toHexString();
        }
    }

    dark.tokenColors = dark.tokenColors.map((value) => {
        if (syntax.includes(value.settings.foreground)) {
            value.settings.foreground = tinycolor(value.settings.foreground).darken(1).desaturate(10).toHexString();
        } else if (value === fg) {
          value.settings.foreground = tinycolor(value.settings.foreground).darken(10).toHexString();
        }
        return value;
    })
    return dark;
};

module.exports = async () => {
    const yamlFile = await readFile(
        join(__dirname, '..', 'src', 'dracula.yml'),
        'utf-8'
    );

    const base = load(yamlFile, { schema });

    for (const key of Object.keys(base.colors)) {
        if (!base.colors[key]) {
            delete base.colors[key];
        }
    }

    return {
        base,
        alucard: transformAlucard(base),
        dark: transformDark(base),
        darker: transformDarker(base),
    };
};
