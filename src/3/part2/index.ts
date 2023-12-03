import fs from 'fs';

const file = fs.readFileSync('./src/3/part2/input', 'utf8');

const lines = file.split('\n');

const gearRatios = [];

type PartNumber = {
    value: number;
    includedBecause: {
        line: number;
        index: number;
    };
    position: {
        line: number;
        index: number;
    };
};

type InclusionChar = {
    line: number;
    index: number;
};

type Inclusion = {
    char: InclusionChar;
    value: string;
};

const inclusions: Inclusion[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const chars = line.split('');
    for (let j = 0; j < chars.length; j++) {
        const char = chars[j];
        if (char === '*') {
            inclusions.push({
                char: {
                    line: i,
                    index: j,
                },
                value: char,
            });
        }
    }
}
function checkForNumbers(startLine: number, startIndex: number): Inclusion | undefined {
    const numbers: number[] = [];
    const thingys: Inclusion[] = [];
    let line = startLine;
    let index = startIndex;
    let offset = 0;
    let breakLeft = false;
    let breakRight = false;
    while (true) {
        let indexLeft = index - offset;
        let indexRight = index + offset;
        if (line > lines.length - 1 || line < 0 || index > lines[line].length - 1 || indexLeft < 0) {
            breakLeft = true;
        }
        if (line > lines.length - 1 || line < 0 || index > lines[line].length - 1 || indexRight > lines[line].length - 1) {
            breakRight = true;
        }
        if (breakLeft && breakRight) {
            break;
        }
        const charLeft = lines[line][indexLeft];
        const charRight = lines[line][indexRight];
        if (charLeft === '.') {
            breakLeft = true;
        }
        if (charRight === '.') {
            breakRight = true;
        }
        if (breakLeft && breakRight) {
            break;
        }

        if (Number.isNaN(parseInt(charLeft, 10))) {
            breakLeft = true;
        }
        if (Number.isNaN(parseInt(charRight, 10))) {
            breakRight = true;
        }
        if (breakLeft && breakRight) {
            break;
        }
        if (indexLeft === indexRight) {
            numbers.push(parseInt(charLeft, 10));
            thingys.push({
                char: {
                    line,
                    index: indexLeft,
                },
                value: charLeft,
            });
        } else {
            if (!breakLeft) {
                numbers.unshift(parseInt(charLeft, 10));
                thingys.unshift({
                    char: {
                        line,
                        index: indexLeft,
                    },
                    value: charLeft,
                });
            }
            if (!breakRight) {
                numbers.push(parseInt(charRight, 10));
                thingys.push({
                    char: {
                        line,
                        index: indexRight,
                    },
                    value: charRight,
                });
            }
        }
        offset++;
    }
    if (numbers.length > 0) {
        return {
            char: {
                line: thingys[0].char.line,
                index: thingys[0].char.index,
            },
            value: numbers.join(''),
        };
    }
    return undefined;
}

for (let i = 0; i < inclusions.length; i++) {
    const inclusion = inclusions[i];
    console.log(inclusion);
    const intermittenResults: PartNumber[] = [];
    const hasValidValueToTheLeft = inclusion.char.index > 0 && !Number.isNaN(parseInt(lines[inclusion.char.line][inclusion.char.index - 1], 10));
    const hasValidValueToTheRight =
        inclusion.char.index < lines[inclusion.char.line].length - 1 && !Number.isNaN(parseInt(lines[inclusion.char.line][inclusion.char.index + 1], 10));
    const hasValidValueAbove = inclusion.char.line > 0 && !Number.isNaN(parseInt(lines[inclusion.char.line - 1][inclusion.char.index], 10));
    const hasValidValueBelow = inclusion.char.line < lines.length - 1 && !Number.isNaN(parseInt(lines[inclusion.char.line + 1][inclusion.char.index], 10));
    const hasValidValueDiagonalTopLeft =
        inclusion.char.line > 0 && inclusion.char.index > 0 && !Number.isNaN(parseInt(lines[inclusion.char.line - 1][inclusion.char.index - 1], 10));
    const hasValidValueDiagonalTopRight =
        inclusion.char.line > 0 &&
        inclusion.char.index < lines[inclusion.char.line].length - 1 &&
        !Number.isNaN(parseInt(lines[inclusion.char.line - 1][inclusion.char.index + 1], 10));
    const hasValidValueDiagonalBottomLeft =
        inclusion.char.line < lines.length - 1 && inclusion.char.index > 0 && !Number.isNaN(parseInt(lines[inclusion.char.line + 1][inclusion.char.index - 1], 10));
    const hasValidValueDiagonalBottomRight =
        inclusion.char.line < lines.length - 1 &&
        inclusion.char.index < lines[inclusion.char.line].length - 1 &&
        !Number.isNaN(parseInt(lines[inclusion.char.line + 1][inclusion.char.index + 1], 10));

    if (hasValidValueToTheLeft) {
        const leftNumber = checkForNumbers(inclusion.char.line, inclusion.char.index - 1);
        if (leftNumber) {
            intermittenResults.push({
                value: parseInt(leftNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: leftNumber.char.line,
                    index: leftNumber.char.index,
                },
            });
        }
    }

    if (hasValidValueToTheRight) {
        const rightNumber = checkForNumbers(inclusion.char.line, inclusion.char.index + 1);
        if (rightNumber) {
            intermittenResults.push({
                value: parseInt(rightNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: rightNumber.char.line,
                    index: rightNumber.char.index,
                },
            });
        }
    }

    // up
    if (!hasValidValueAbove && hasValidValueDiagonalTopLeft) {
        const diagonalLeftNumber = checkForNumbers(inclusion.char.line - 1, inclusion.char.index - 1);
        if (diagonalLeftNumber) {
            intermittenResults.push({
                value: parseInt(diagonalLeftNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: diagonalLeftNumber.char.line,
                    index: diagonalLeftNumber.char.index,
                },
            });
        }
    }
    if (!hasValidValueAbove && hasValidValueDiagonalTopRight) {
        const diagonalRightNumber = checkForNumbers(inclusion.char.line - 1, inclusion.char.index + 1);
        if (diagonalRightNumber) {
            intermittenResults.push({
                value: parseInt(diagonalRightNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: diagonalRightNumber.char.line,
                    index: diagonalRightNumber.char.index,
                },
            });
        }
    }

    if (hasValidValueAbove) {
        const middleNumber = checkForNumbers(inclusion.char.line - 1, inclusion.char.index);
        if (middleNumber) {
            intermittenResults.push({
                value: parseInt(middleNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: middleNumber.char.line,
                    index: middleNumber.char.index,
                },
            });
        }
    }

    if (!hasValidValueBelow && hasValidValueDiagonalBottomLeft) {
        const diagonalLeftNumberDown = checkForNumbers(inclusion.char.line + 1, inclusion.char.index - 1);
        if (diagonalLeftNumberDown) {
            intermittenResults.push({
                value: parseInt(diagonalLeftNumberDown.value),
                includedBecause: inclusion.char,
                position: {
                    line: diagonalLeftNumberDown.char.line,
                    index: diagonalLeftNumberDown.char.index,
                },
            });
        }
    }
    if (!hasValidValueBelow && hasValidValueDiagonalBottomRight) {
        const diagonalRightNumberDown = checkForNumbers(inclusion.char.line + 1, inclusion.char.index + 1);
        if (diagonalRightNumberDown) {
            intermittenResults.push({
                value: parseInt(diagonalRightNumberDown.value),
                includedBecause: inclusion.char,
                position: {
                    line: diagonalRightNumberDown.char.line,
                    index: diagonalRightNumberDown.char.index,
                },
            });
        }
    }

    if (hasValidValueBelow) {
        const middleNumber = checkForNumbers(inclusion.char.line + 1, inclusion.char.index);
        if (middleNumber) {
            intermittenResults.push({
                value: parseInt(middleNumber.value),
                includedBecause: inclusion.char,
                position: {
                    line: middleNumber.char.line,
                    index: middleNumber.char.index,
                },
            });
        }
    }

    if (intermittenResults.length === 2) {
        console.log('intermittenResults', intermittenResults);
        const first = intermittenResults[0];
        const second = intermittenResults[1];

        gearRatios.push(first.value * second.value);
    }
}

let sum = 0;
for (let i = 0; i < gearRatios.length; i++) {
    const part = gearRatios[i];
    sum = sum + part;
}

console.log('Answer:', sum);
