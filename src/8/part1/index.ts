import fs from 'fs';

const file = fs.readFileSync('./src/8/part1/input', 'utf8');

const lines = file.split('\n');

type Node = {
    name: string;
    l: string;
    r: string;
};

const nodes: Node[] = [];

function chooseLeft(node: Node) {
    const left = nodes.find((n) => n.name === node.l);
    if (left) {
        return left;
    }
    process.exit(1);
}

function chooseRight(node: Node) {
    const right = nodes.find((n) => n.name === node.r);
    if (right) {
        return right;
    }
    process.exit(1);
}

let steps = 0;

const directions = lines[0].split('');
lines.shift();
lines.shift();

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [name, l, r] = line.split(' ');
    nodes.push({ name, l, r });
}

const end = 'ZZZ'
console.time('test');
let currentNode = nodes.find((n) => n.name === 'AAA')!;
let i = 0;
let endIt = false;
while (!endIt) {
    steps++;
    const direction = directions[i];

    if (direction === 'L') {
        currentNode = chooseLeft(currentNode);
    } else if (direction === 'R') {
        currentNode = chooseRight(currentNode);
    } else {
        process.exit(1);
    }
    if (currentNode.name === end) {
        console.timeEnd('test');
        console.log('Answer:', steps);
        endIt = true;
        break;
    }
    if (i === directions.length -1) {
        console.log('yeet:', i);
        console.timeLog('test', 'steps:', steps);
        i = 0;
    } else {
        i++;
    }
}

console.log('Answer:', steps);
