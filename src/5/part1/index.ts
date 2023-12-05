import fs from 'fs';

const file = fs.readFileSync('./src/5/part1/input', 'utf8');

const lines = file.split('\n');

const getMapValue = (maps: ValueMap[], value: number) => {
    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        if (map.source <= value && map.source + map.range >= value) {
            const offset = value - map.source;
            return map.destination + offset ;
        }
    }
};

type Seed = {
    value: number;
    soil?: number;
    fertilizer?: number;
    water?: number;
    light?: number;
    temperature?: number;
    humidity?: number;
    location?: number;
};

const seeds: Seed[] = [];

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
console.log(seedsFile);

for (let i = 0; i < seedsFile.length; i++) {
    const seed = seedsFile[i];
    seeds.push({
        value: parseInt(seed, 10),
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

for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    // console.log(seed);

    // from seed to soil
    const soilmap = maps.filter((x) => x.from === 'seed' && x.to === 'soil');
    const soilVal = getMapValue(soilmap, seed.value);
    if (soilVal) {
        seed.soil = soilVal;
    } else {
        seed.soil = seed.value;
    }

    // from soil to fertilizer
    const fertilizermap = maps.filter((x) => x.from === 'soil' && x.to === 'fertilizer');
    const fertilizerVal = getMapValue(fertilizermap, seed.soil);
    if (fertilizerVal) {
        seed.fertilizer = fertilizerVal;
    } else {
        seed.fertilizer = seed.soil;
    }

    // from fertilizer to water
    const watermap = maps.filter((x) => x.from === 'fertilizer' && x.to === 'water');
    const waterVal = getMapValue(watermap, seed.fertilizer);
    if (waterVal) {
        seed.water = waterVal;
    } else {
        seed.water = seed.fertilizer;
    }

    // from water to light
    const lightmap = maps.filter((x) => x.from === 'water' && x.to === 'light');
    const lightVal = getMapValue(lightmap, seed.water);
    if (lightVal) {
        seed.light = lightVal;
    } else {
        seed.light = seed.water;
    }

    // from light to temperature
    const temperaturemap = maps.filter((x) => x.from === 'light' && x.to === 'temperature');
    const temperatureVal = getMapValue(temperaturemap, seed.light);
    if (temperatureVal) {
        seed.temperature = temperatureVal;
    } else {
        seed.temperature = seed.light;
    }

    // from temperature to humidity
    const humiditymap = maps.filter((x) => x.from === 'temperature' && x.to === 'humidity');
    const humidityVal = getMapValue(humiditymap, seed.temperature);
    if (humidityVal) {
        seed.humidity = humidityVal;
    } else {
        seed.humidity = seed.temperature;
    }

    // from humidity to location
    const locationmap = maps.filter((x) => x.from === 'humidity' && x.to === 'location');
    const locationVal = getMapValue(locationmap, seed.humidity);
    if (locationVal) {
        seed.location = locationVal;
    } else {
        seed.location = seed.humidity;
    }
}

const sortedSeeds = seeds.sort((a, b) => {
    if (!a.location || !b.location) {
        return 0;
    }
    return a.location - b.location;
});
console.log(sortedSeeds);
const lowest = sortedSeeds[0].location;

console.log('Answer:', lowest);
