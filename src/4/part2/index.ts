import fs from 'fs';

const file = fs.readFileSync('./src/4/part2/input', 'utf8');

const lines = file.split('\n');

type CardInfo = {
    index: number;
    instanceCoutner: number;
};

const cardQueue: CardInfo[] = lines.map((_, i) => ({
    index: i,
    instanceCoutner: 1,
}));

for(let i = 0; i < cardQueue.length; i++) {
    const card = cardQueue[i];
    const line = lines[card.index];
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
            winValue++;
        }
    }

    if (winValue > 0) {
        for (let j = 0; j < winValue; j++) {
            const nextNr = card.index + j + 1;
            if (nextNr >= lines.length) {
                continue;
            } else {
                const nextCard = cardQueue.find((x) => x.index === nextNr);
                if (nextCard) {
                    nextCard.instanceCoutner = nextCard.instanceCoutner + card.instanceCoutner;
                } 
            }
        }
    }
}

const sum = cardQueue.reduce((a, b) => a + b.instanceCoutner, 0);

console.log('Answer:', sum);
