import fs from 'fs';

const file = fs.readFileSync('./src/1/part1/input', 'utf8');
const lines = file.split('\n');
const nrInLines = lines.map((line) => {
    let first;
    let last;
    const chars = line.split('');
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        try {
            const nr = parseInt(char, 10);
            if (isNaN(nr)) continue;
            if (!first) {
                first = char;
                last = char;
            } else {
                last = char;
            }
        } catch (e) {
            console.log('not a number');
        }
    }
    if (!first || !last) {
        console.log('no numbers found');
        return '0';
    }
    return first + last;
});

const nrInLinesAsNumbers = nrInLines.map((nr) => {
    if (!nr) {
        return 0;
    }
    return parseInt(nr, 10);
});
const sum = nrInLinesAsNumbers.reduce((a, b) => a + b, 0);

console.log('Asnwer:', sum);
