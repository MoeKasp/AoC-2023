import fs from 'fs';

const file = fs.readFileSync('./src/7/part1/input', 'utf8');

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

const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const isFiveOfAKind = (hand: Hand): CardResult => {
    const cards = hand.cards;

    const firstCard = cards[0];

    for (let i = 1; i < cards.length; i++) {
        const card = cards[i];

        if (card !== firstCard) {
            return {
                card: '',
                result: false,
            };
        }
    }

    return {
        card: firstCard,
        result: true,
    };
};

const isFourOfAKind = (hand: Hand): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';
    for (let i = 1; i < cards.length; i++) {
        let count = 0;

        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i]) {
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
    for (let i = 1; i < cards.length; i++) {
        let count = 0;
        if (cards[i] === ignoreCard) {
            continue;
        }
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i]) {
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

const isPair = (hand: Hand, ignoreCard?: string): CardResult => {
    const cards = hand.cards;

    let result = false;
    let resCard = '';
    for (let i = 1; i < cards.length; i++) {
        let count = 0;
        if (cards[i] === ignoreCard) {
            continue;
        }
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            if (card === cards[i]) {
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

const isTwoPairs = (hand: Hand): CardResult => {
    const cards = hand.cards;

    const firstPair = isPair(hand);

    if (firstPair.result) {
        const secondPair = isPair(hand, firstPair.card);

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
}

const isFullHouse = (hand: Hand): CardResult => {
    const threeOfAKind = isThreeOfAKind(hand);

    if (threeOfAKind.result) {
        const pair = isPair(hand, threeOfAKind.card);

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
}

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
}


const getHighestCard = (hand: Hand): string => {
    const cards = hand.cards;

    let highestCard = '';
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        if (cardRanks.indexOf(card) > cardRanks.indexOf(highestCard)) {
            highestCard = card;
        }
    }

    console.log(hand.cards, highestCard);

    return highestCard;
}

const compareHighestCard = (handA: Hand, handB: Hand) => {
    const aHighestCard = getHighestCard(handA);
    const bHighestCard = getHighestCard(handB);

    console.log(aHighestCard, bHighestCard);

    if (aHighestCard === bHighestCard) {
        return 3;
    }
    console.log(cardRanks.indexOf(aHighestCard), cardRanks.indexOf(bHighestCard));
    if (cardRanks.indexOf(aHighestCard) > cardRanks.indexOf(bHighestCard)) {
        return 1;
    }
    if (cardRanks.indexOf(aHighestCard) < cardRanks.indexOf(bHighestCard)) {
        return -1;
    }
    if (cardRanks.indexOf(aHighestCard) === cardRanks.indexOf(bHighestCard)) {
        return 3;
    }
    return 0;
}

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
}


const compHandsByFunc = (handA: Hand, handB: Hand, func: (hand: Hand) => CardResult) => {
    const aResult = func(handA);
    const bResult = func(handB);

    if (aResult.result && !bResult.result) {
        addPowerToHand(handA, func.name);
        return 1;
    } else if (!aResult.result && bResult.result) {
        addPowerToHand(handB, func.name);
        return -1;
    } else if (aResult.result && bResult.result) {
        addPowerToHand(handA, func.name);
        addPowerToHand(handB, func.name);
        return 3;
    }

    return 0;
}

const sortedHands = hands.sort((a, b) => {
    const fives = compHandsByFunc(a, b, isFiveOfAKind);
    if (fives === 3) return compareCardsByRankInOrder(a, b);
    if (fives !== 0) return fives;

    const fours = compHandsByFunc(a, b, isFourOfAKind);
    if (fours === 3) return compareCardsByRankInOrder(a, b);
    if (fours !== 0) return fours;

    const fullHouses = compHandsByFunc(a, b, isFullHouse);
    if (fullHouses === 3) return compareCardsByRankInOrder(a, b);
    if (fullHouses !== 0) return fullHouses;

    const threes = compHandsByFunc(a, b, isThreeOfAKind);
    if (threes === 3) {
        const c = compareCardsByRankInOrder(a, b);
        return c;
    }
    if (threes !== 0) return threes;

    const twos = compHandsByFunc(a, b, isTwoPairs);
    if (twos === 3) return compareCardsByRankInOrder(a, b);
    if (twos !== 0) return twos;

    const pairs = compHandsByFunc(a, b, isPair);
    if (pairs === 3) return compareCardsByRankInOrder(a, b);
    if (pairs !== 0) return pairs;

    /*
    const highestCard = compareHighestCard(a, b);
    if (highestCard === 3) return compareCardsByRankInOrder(a, b);
    if (highestCard !== 0) return highestCard;
    */
    return compareCardsByRankInOrder(a, b);
});

let sum = 0;
for (let i = 0; i < sortedHands.length; i++) {
    console.log(sortedHands[i]);
    const hand = sortedHands[i];
    sum += hand.bet * (i + 1);
}

console.log(sortedHands.length);

console.log('Answer:', sum);
