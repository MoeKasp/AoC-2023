import fs from 'fs';

const file = fs.readFileSync('./src/5/part2/input', 'utf8');

const lines = file.split('\n');
console.time('Time');
const getMapValue = (maps: ValueMap[], value: number) => {
    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        if (map.source <= value && map.source + map.range >= value) {
            const offset = value - map.source;
            return map.destination + offset;
        }
    }
};

type Seed = {
    value: number;
    range: number;
    soil?: number;
    fertilizer?: number;
    water?: number;
    light?: number;
    temperature?: number;
    humidity?: number;
    location?: number;
};

const seeds: Seed[] = [];
const coolSeeds: Seed[] = [];

type ValueMap = {
    from: string;
    to: string;
    destination: number;
    source: number;
    range: number;
};

const maps: ValueMap[] = [];

const line = lines[0];
const seedsFile = line.split(' ');
seedsFile.shift();
let i = 0;
while (i < seedsFile.length) {
    const seed = seedsFile[i];
    i++;
    const range = seedsFile[i];
    i++;
    const rangeNr = parseInt(range, 10);
    seeds.push({
        value: parseInt(seed, 10),
        range: rangeNr,
    });
}

let currentFrom;
let currentTo;
for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) {
        continue;
    }
    if (line.indexOf('-to-') !== -1) {
        let splitted = line.split('-to-');
        currentFrom = splitted[0];
        currentTo = splitted[1].slice(0, -5);
        continue;
    }
    if (!currentFrom || !currentTo) {
        continue;
    }
    const splitted = line.split(' ');
    maps.push({
        from: currentFrom,
        to: currentTo,
        destination: parseInt(splitted[0], 10),
        source: parseInt(splitted[1], 10),
        range: parseInt(splitted[2], 10),
    });
}
const soilmap = maps.filter((x) => x.from === 'seed' && x.to === 'soil');
const fertilizermap = maps.filter((x) => x.from === 'soil' && x.to === 'fertilizer');
const watermap = maps.filter((x) => x.from === 'fertilizer' && x.to === 'water');
const lightmap = maps.filter((x) => x.from === 'water' && x.to === 'light');
const temperaturemap = maps.filter((x) => x.from === 'light' && x.to === 'temperature');
const humiditymap = maps.filter((x) => x.from === 'temperature' && x.to === 'humidity');
const locationmap = maps.filter((x) => x.from === 'humidity' && x.to === 'location');

for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    let lowestSeed;
    for (let j = 0; j < seed.range; j++) {
        const newSeed: Seed = {
            value: seed.value + j,
            range: 0,
        };
        // from seed to soil
        const soilVal = getMapValue(soilmap, newSeed.value);
        if (soilVal) {
            newSeed.soil = soilVal;
        } else {
            newSeed.soil = newSeed.value;
        }

        // from soil to fertilizer
        const fertilizerVal = getMapValue(fertilizermap, newSeed.soil);
        if (fertilizerVal) {
            newSeed.fertilizer = fertilizerVal;
        } else {
            newSeed.fertilizer = newSeed.soil;
        }

        // from fertilizer to water
        const waterVal = getMapValue(watermap, newSeed.fertilizer);
        if (waterVal) {
            newSeed.water = waterVal;
        } else {
            newSeed.water = newSeed.fertilizer;
        }

        // from water to light
        const lightVal = getMapValue(lightmap, newSeed.water);
        if (lightVal) {
            newSeed.light = lightVal;
        } else {
            newSeed.light = newSeed.water;
        }

        // from light to temperature
        const temperatureVal = getMapValue(temperaturemap, newSeed.light);
        if (temperatureVal) {
            newSeed.temperature = temperatureVal;
        } else {
            newSeed.temperature = newSeed.light;
        }

        // from temperature to humidity
        const humidityVal = getMapValue(humiditymap, newSeed.temperature);
        if (humidityVal) {
            newSeed.humidity = humidityVal;
        } else {
            newSeed.humidity = newSeed.temperature;
        }

        // from humidity to location
        const locationVal = getMapValue(locationmap, newSeed.humidity);
        if (locationVal) {
            newSeed.location = locationVal;
        } else {
            newSeed.location = newSeed.humidity;
        }
        if (!lowestSeed || !lowestSeed.location||  newSeed.location < lowestSeed.location) {
            lowestSeed = newSeed;
        }
    }
    // console.log(seed);
    if (lowestSeed) {
        coolSeeds.push(lowestSeed);
    }


    // from seed to soil
    const soilVal = getMapValue(soilmap, seed.value);
    if (soilVal) {
        seed.soil = soilVal;
    } else {
        seed.soil = seed.value;
    }

    // from soil to fertilizer
    const fertilizerVal = getMapValue(fertilizermap, seed.soil);
    if (fertilizerVal) {
        seed.fertilizer = fertilizerVal;
    } else {
        seed.fertilizer = seed.soil;
    }

    // from fertilizer to water
    const waterVal = getMapValue(watermap, seed.fertilizer);
    if (waterVal) {
        seed.water = waterVal;
    } else {
        seed.water = seed.fertilizer;
    }

    // from water to light
    const lightVal = getMapValue(lightmap, seed.water);
    if (lightVal) {
        seed.light = lightVal;
    } else {
        seed.light = seed.water;
    }

    // from light to temperature
    const temperatureVal = getMapValue(temperaturemap, seed.light);
    if (temperatureVal) {
        seed.temperature = temperatureVal;
    } else {
        seed.temperature = seed.light;
    }

    // from temperature to humidity
    const humidityVal = getMapValue(humiditymap, seed.temperature);
    if (humidityVal) {
        seed.humidity = humidityVal;
    } else {
        seed.humidity = seed.temperature;
    }

    // from humidity to location
    const locationVal = getMapValue(locationmap, seed.humidity);
    if (locationVal) {
        seed.location = locationVal;
    } else {
        seed.location = seed.humidity;
    }
    coolSeeds.push(seed);
    console.timeLog('Time', i);
}

const sortedSeeds = coolSeeds.sort((a, b) => {
    if (!a.location || !b.location) {
        return 0;
    }
    return a.location - b.location;
});
console.log(sortedSeeds);
const lowest = sortedSeeds[0].location;

console.log('Answer:', lowest);
console.timeEnd('Time');
