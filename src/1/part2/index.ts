import fs from 'fs';
const numberAsWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const file = fs.readFileSync('./src/1/part2/input', 'utf8');
const lines = file.split('\n');
let ran = false;
const nrInLines = lines.map((line) => {
    if (ran) {
        return '0';
    }

    let first;
    let firstIndex = 9999999999999;
    let last;
    let lastIndex = -2;
    let firstWord;
    let firstWordIndex = 9999999999;
    let lastWord;
    let lastWordIndex = -2;

    // number handling
    const chars = line.split('');
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        try {
            const nr = parseInt(char, 10);
            if (isNaN(nr)) continue;
            if (!first) {
                first = char;
                firstIndex = i;
                last = char;
                lastIndex = i;
            } else {
                last = char;
                lastIndex = i;
            }
        } catch (e) {
            console.log('not a number');
        }
    }

    // word handling
    let containingNumberWords = [];
    for (let i = 0; i < numberAsWords.length; i++) {
        const word = numberAsWords[i];
        if (line.includes(word)) {
            containingNumberWords.push(word);
        }
    }
    if (containingNumberWords.length > 0) {
        for (let i = 0; i < containingNumberWords.length; i++) {
            const word = containingNumberWords[i];

            const index = line.indexOf(word);
            const lastIndexOfWord = line.lastIndexOf(word);
            console.log({ index, lastIndexOfWord, word, firstWordIndex, lastWordIndex });
            const wordIndex = numberAsWords.indexOf(word).toString();

            if (!firstWord) {
                firstWord = wordIndex;
                firstWordIndex = index;
            }
            if (index < firstWordIndex) {
                firstWord = wordIndex;
                firstWordIndex = index;
            }
            if (!lastWord) {
                const usedI = Math.max(index, lastIndexOfWord);
                lastWord = wordIndex;
                lastWordIndex = usedI;
            }
            if (lastIndexOfWord > lastWordIndex) {
                lastWord = wordIndex;
                lastWordIndex = lastIndexOfWord;
            }
        }
    }

    if (firstWord && firstWordIndex < firstIndex) {
        first = firstWord;
        firstIndex = firstWordIndex;
    }
    if (firstWord && firstWordIndex > lastIndex) {
        last = firstWord;
        lastIndex = firstWordIndex;
    }
    if (lastWord && lastWordIndex > lastIndex) {
        last = lastWord;
        lastIndex = lastWordIndex;
    }
    if (lastWord && lastWordIndex < firstIndex) {
        first = lastWord;
        firstIndex = lastWordIndex;
    }

    if (!first || !last) {
        console.log('no numbers found');
        return '0';
    }
    const combined = first + last;

    return combined;
});

const nrInLinesAsNumbers = nrInLines.map((nr) => {
    if (!nr) {
        return 0;
    }
    return parseInt(nr, 10);
});
const sum = nrInLinesAsNumbers.reduce((a, b) => a + b, 0);

console.log('Asnwer:', sum);
