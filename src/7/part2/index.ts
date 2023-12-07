import fs from 'fs';

const file = fs.readFileSync('./src/7/part2/input', 'utf8');

const lines = file.split('\n');

type Hand = {
    cards: string[];
    bet: number;
    power?: number;
};

type CardResult = {
    card: string;
    result: boolean;
};

const hands: Hand[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const splittedLine = line.split(' ');

    const filteredLine = splittedLine.filter((item) => item !== '');

    hands.push({
        cards: filteredLine[0].split(''),
        bet: parseInt(filteredLine[1]),
    });
}

const cardRanks = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

const isFiveOfAKind = (hand: Hand): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';
    for (let i = 0; i < cards.length; i++) {
        let count = 0;

        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i] || card === 'J') {
                count++;
            }

            if (count === 5) {
                resCard = cards[i];
                result = true;
                break;
            }
        }
    }
    return {
        card: resCard,
        result,
    };
};

const isFourOfAKind = (hand: Hand): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';
    for (let i = 0; i < cards.length; i++) {
        let count = 0;

        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i] || card === 'J') {
                count++;
            }

            if (count === 4) {
                resCard = cards[i];
                result = true;
                break;
            }
        }
    }
    return {
        card: resCard,
        result,
    };
};

const isThreeOfAKind = (hand: Hand, ignoreCard?: string): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';
    for (let i = 0; i < cards.length; i++) {
        let count = 0;
        if (result) {
            break;
        }
        if (cards[i] === ignoreCard) {
            continue;
        }
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i] || card === 'J') {
                count++;
            }

            if (count === 3) {
                resCard = cards[i];
                result = true;
                break;
            }
        }
    }
    return {
        card: resCard,
        result,
    };
};

const isThreeOfAKindTakeAway = (hand: Hand, res: CardResult, ignoreCard?: string): string[] => {
    const cards = hand.cards;

    const filteredCards = cards.filter((card) => card !== res.card);
    if (filteredCards.length === 4) {
        filteredCards.splice(filteredCards.indexOf('J'), 1);
        filteredCards.splice(filteredCards.indexOf('J'), 1);

    }
    if (filteredCards.length === 3) {
        filteredCards.splice(filteredCards.indexOf('J'), 1);
    }
    return filteredCards;
};

const isPair = (hand: Hand, ignoreCard?: string): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';

    for (let i = 0; i < cards.length; i++) {
        let count = 0;
        if (cards[i] === ignoreCard) {
            continue;
        }
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i] || card === 'J') {
                count++;
            }

            if (count === 2) {
                resCard = cards[i];
                result = true;
                break;
            }
        }
    }
    return {
        card: resCard,
        result,
    };
};

const isPairTakeAway = (hand: Hand, res: CardResult, ignoreCard?: string): string[] => {
    const cards = hand.cards;

    const filteredCards = cards.filter((card) => card !== res.card);
    if (filteredCards.length === 4) {
        filteredCards.splice(filteredCards.indexOf('J'), 1);
    }
    return filteredCards;
}

const isTwoPairs = (hand: Hand): CardResult => {
    const cards = hand.cards;

    const firstPair = isPair(hand);

    if (firstPair.result) {
        const rest = isPairTakeAway(hand, firstPair);
        const secondPair = isPair(
            {
                cards: rest,
                bet: hand.bet,
            },
            firstPair.card
        );

        if (secondPair.result) {
            return {
                card: firstPair.card,
                result: true,
            };
        }
    }

    return {
        card: '',
        result: false,
    };
};

const isFullHouse = (hand: Hand): CardResult => {
    const threeOfAKind = isThreeOfAKind(hand);

    if (threeOfAKind.result) {
        const rest = isThreeOfAKindTakeAway(hand, threeOfAKind)
        console.log(rest);
        const pair = isPair(
            {
                cards: rest,
                bet: hand.bet,
            },
            threeOfAKind.card
        );

        if (pair.result) {
            return {
                card: threeOfAKind.card,
                result: true,
            };
        }
    }

    return {
        card: '',
        result: false,
    };
};

const compareCardsByRankInOrder = (handA: Hand, handB: Hand): number => {
    const cardsA = handA.cards;
    const cardsB = handB.cards;

    for (let i = 0; i < cardsA.length; i++) {
        const cardA = cardsA[i];
        const cardB = cardsB[i];

        if (cardRanks.indexOf(cardA) > cardRanks.indexOf(cardB)) {
            return 1;
        } else if (cardRanks.indexOf(cardA) < cardRanks.indexOf(cardB)) {
            return -1;
        }
    }

    return 0;
};

const addPowerToHand = (hand: Hand, funcName: string) => {
    switch (funcName) {
        case 'isFiveOfAKind':
            hand.power = 6;
            break;
        case 'isFourOfAKind':
            hand.power = 5;
            break;
        case 'isFullHouse':
            hand.power = 4;
            break;
        case 'isThreeOfAKind':
            hand.power = 3;
            break;
        case 'isTwoPairs':
            hand.power = 2;
            break;
        case 'isPair':
            hand.power = 1;
            break;
        default:
            hand.power = 0;
            break;
    }
};

for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];

    const fiveOfAKind = isFiveOfAKind(hand);
    const fourOfAKind = isFourOfAKind(hand);
    const fullHouse = isFullHouse(hand);
    const threeOfAKind = isThreeOfAKind(hand);
    const twoPairs = isTwoPairs(hand);
    const pair = isPair(hand);

    if (fiveOfAKind.result) {
        addPowerToHand(hand, 'isFiveOfAKind');
    } else if (fourOfAKind.result) {
        addPowerToHand(hand, 'isFourOfAKind');
    } else if (fullHouse.result) {
        addPowerToHand(hand, 'isFullHouse');
    } else if (threeOfAKind.result) {
        addPowerToHand(hand, 'isThreeOfAKind');
    } else if (twoPairs.result) {
        addPowerToHand(hand, 'isTwoPairs');
    } else if (pair.result) {
        addPowerToHand(hand, 'isPair');
    } else {
        addPowerToHand(hand, 'isNothing');
    }
}
const sortedHands = hands.sort((a, b) => {
    if (typeof a.power === 'undefined' || typeof b.power === 'undefined') {
        return 0;
    }
    if (a.power === b.power) {
        return compareCardsByRankInOrder(a, b);
    }
    return a.power > b.power ? 1 : -1;
});

let sum = 0;
for (let i = 0; i < sortedHands.length; i++) {
    const hand = sortedHands[i];

    console.log(sortedHands[i]);

    sum += hand.bet * (i + 1);
}

// write to out file
const out = fs.createWriteStream('./src/7/part2/output');
for (let i = 0; i < sortedHands.length; i++) {
    const hand = sortedHands[i];

    out.write(hand.cards.join('') +  '\n');
}
out.end();


console.log(sortedHands.length);

console.log('Answer:', sum);
