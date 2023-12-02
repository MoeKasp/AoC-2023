import fs from 'fs';

const file = fs.readFileSync('./src/2/part1/input', 'utf8');

const lines = file.split('\n');

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const impossibleGames: number[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let tokens = line.split(' ');

    tokens.shift();
    tokens.shift();
    const draws = tokens.join(' ').split(';');
    for (let j = 0; j < draws.length; j++) {
        if (impossibleGames.includes(i)) continue;
        const draw = draws[j];
        const drawTokens = draw.split(',');
        for (let k = 0; k < drawTokens.length; k++) {
            const drawToken = drawTokens[k];
            if (drawToken) {
                const splitDrawToken = drawToken.trim().split(' ');
                const color = splitDrawToken[1];
                const number = splitDrawToken[0];
                if (color === 'red' && parseInt(number, 10) > MAX_RED) {
                    impossibleGames.push(i);
                    continue;
                }
                if (color === 'green' && parseInt(number, 10) > MAX_GREEN) {
                    impossibleGames.push(i);
                    continue;
                }
                if (color === 'blue' && parseInt(number, 10) > MAX_BLUE) {
                    impossibleGames.push(i);
                    continue;
                }
            }
        }
    }
}

let sum = 0;
for (let i = 0; i < lines.length; i++) {
    if (!impossibleGames.includes(i)) {
        sum = sum + i + 1;
    }
}

console.log('Answer:', sum);
