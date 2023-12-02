import fs from 'fs';

const file = fs.readFileSync('./src/2/part2/input', 'utf8');

const lines = file.split('\n');

const gamePowers: number[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let tokens = line.split(' ');

    tokens.shift();
    tokens.shift();
    let highestRed = 0;
    let highestGreen = 0;
    let highestBlue = 0;
    const draws = tokens.join(' ').split(';');
    for (let j = 0; j < draws.length; j++) {
        const draw = draws[j];
        const drawTokens = draw.split(',');
        for (let k = 0; k < drawTokens.length; k++) {
            const drawToken = drawTokens[k];
            if (drawToken) {
                const splitDrawToken = drawToken.trim().split(' ');
                const color = splitDrawToken[1];
                const numberString = splitDrawToken[0];
                const number = parseInt(numberString, 10);
                if (color === 'red' && number > highestRed) {
                    highestRed = number;
                }
                if (color === 'green' && number > highestGreen) {
                    highestGreen = number;
                }
                if (color === 'blue' && number > highestBlue) {
                    highestBlue = number;
                }
            }
        }
    }

    gamePowers.push(highestRed * highestGreen * highestBlue);
}

let sum = gamePowers.reduce((a, b) => a + b, 0);

console.log('Answer:', sum);
