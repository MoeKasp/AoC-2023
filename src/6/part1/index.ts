import fs from 'fs';

const file = fs.readFileSync('./src/6/part1/input', 'utf8');

const lines = file.split('\n');

type TimeDistance = {
    time: number;
    distance?: number;
};

const times: TimeDistance[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const splittedLine = line.split(' ');

    const filteredLine = splittedLine.filter((item) => item !== '');

    if (filteredLine[0] === 'Time:') {
        for (let j = 1; j < filteredLine.length; j++) {
            const item = filteredLine[j];

            times.push({
                time: parseInt(item),
            });
        }
    } else if (filteredLine[0] === 'Distance:') {
        for (let j = 1; j < filteredLine.length; j++) {
            const item = filteredLine[j];

            times[j - 1].distance = parseInt(item);
        }
    }
}

console.log(times);

const calculateWaysToWin = (time: TimeDistance) => {
    const ways = [];
    if (time.distance === undefined) throw new Error('Distance is undefined');

    for (let i = 1; i <= time.time; i++) {
        const velocity = i;
        const timeDriving = time.time - i;
        const distance = velocity * timeDriving;
        if (distance > time.distance) {
            ways.push(i);
        }
    }

    return ways;
};

const waysToWin = [];
for (let i = 0; i < times.length; i++) {
    const time = times[i];

    const ways = calculateWaysToWin(time);

    console.log('Time:', time.time, 'Ways:', ways);
    waysToWin.push(ways.length);
}

const multi = waysToWin.reduce((acc, cur) => acc * cur, 1);

console.log('Answer:', multi);
