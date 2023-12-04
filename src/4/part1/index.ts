import fs from 'fs';

const file = fs.readFileSync('./src/4/part1/input', 'utf8');

const lines = file.split('\n');

const winValues = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indexOfColon = line.indexOf(':');
    if (indexOfColon === -1) {
        continue;
    }
    const splittedParts = line.split(':')[1].split(' ');
    const winningNumbers = [];
    const myNumbers = [];
    let reachedBreak = false;
    for (let j = 0; j < splittedParts.length; j++) {
        const number = parseInt(splittedParts[j]);
        if (splittedParts[j] === '|') {
            reachedBreak = true;
            continue;
        }
        if (isNaN(number)) {
            continue;
        }
        if (reachedBreak) {
            myNumbers.push(number);
            continue;
        }
        winningNumbers.push(number);
    }

    let winValue = 0;
    for (let j = 0; j < winningNumbers.length; j++) {
        const winNr = winningNumbers[j];
        if (myNumbers.includes(winNr)) {
            if (winValue === 0) {
                winValue++;
            } else {
                winValue *= 2;
            }
        }
    }
    winValues.push(winValue);
}

const sum = winValues.reduce((a, b) => a + b, 0);

console.log('Answer:', sum);
