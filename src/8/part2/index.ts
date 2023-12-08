import fs from 'fs';

const file = fs.readFileSync('./src/8/part2/input', 'utf8');

const lines = file.split('\n');

type Node = {
    name: string;
    l: string;
    r: string;
    s2z?: number;
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

let currentNodes: Node[] = [];
nodes.forEach((n) => {
    if (n.name.endsWith('A')) {
        currentNodes.push(n);
    }
});
for (let j = 0; j < currentNodes.length; j++) {
    const startnode = currentNodes[j];
    const startnodename = startnode.name;
    let currentNode = currentNodes[j];
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
        if (currentNode.name.endsWith('Z')) {
            startnode.s2z = steps;
            break;
        }
        if (i === directions.length - 1) {
            i = 0;
        } else {
            i++;
        }
    }

    console.log('startnodename:', startnodename);
    console.log('steps to Z:', steps);
    steps = 0;
}

console.log(currentNodes);

function greatesCommonDivisor(a: number, b: number): number {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lowestCommonMultiplier(a: number, b: number): number {
    return (a * b) / greatesCommonDivisor(a, b);
}

function lcmArray(arr: number[]): number {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = lowestCommonMultiplier(result, arr[i]);
    }
    return result;
}

const solution = lcmArray(currentNodes.map((n) => n.s2z!));

console.log('Answer:', solution);
