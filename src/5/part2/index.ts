import fs from 'fs';

const file = fs.readFileSync('./src/5/part2/test', 'utf8');

const lines = file.split('\n');

const getMapValue = (maps: ValueMap[], value: number) => {
    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        if (map.source <= value && map.source + map.range >= value) {
            const offset = value - map.source;
            return { startval: map.destination + offset, map };
        }
    }
};

const findBestPossibleMaps = (maps: ValueMap[], value: number, range: number) => {
    const results: RangeMap[] = [];

    const possibleMaps = maps.filter((x) => x.source + x.range >= value + range);
    if (possibleMaps.length === 0) {
        return [
            {
                from: value,
                to: value + range,
                startValue: value,
            },
        ];
    }
    const sortedPossibleMaps = possibleMaps.sort((a, b) => a.source - b.source);
    const closestMap = sortedPossibleMaps[0];
    if (!closestMap) {
        return [
            {
                from: value,
                to: value + range,
                startValue: value,
            },
        ];
    }
    results.push({
        from: value,
        to: closestMap.source,
        startValue: value,
    });
    range = range - (closestMap.source - value);
    if (range <= 0) {
        return results;
    }
    if (closestMap.source + closestMap.range > closestMap.source + range) {
        results.push({
            from: closestMap.source,
            to: closestMap.source + range,
            startValue: closestMap.source,
        });
    } else {
        results.push({
            from: closestMap.source,
            to: closestMap.source + closestMap.range,
            startValue: closestMap.source,
        });
    }

    return results;
};
const getRangeMaps = (maps: ValueMap[], value: number, range: number) => {
    const result: RangeMap[] = [];
    let startingSeed = value;
    let seedsLeft = range;
    while (seedsLeft > 0) {
        const res = getMapValue(maps, startingSeed);
        if (!res) {
            console.log('no res found');
            const yeet = findBestPossibleMaps(maps, startingSeed, seedsLeft);
            if (!yeet) {
                console.log('no yeet found');
                break;
            }
            result.push(...yeet);
            const lastRange = yeet[yeet.length - 1];
            if (lastRange.to >= startingSeed + seedsLeft) {
                lastRange.to = startingSeed + seedsLeft;
                seedsLeft = 0;
                continue;
            } else {
                seedsLeft = seedsLeft - (lastRange.to - startingSeed);
                startingSeed = lastRange.to;
                continue;
            }
        }
        const { startval, map } = res;
        if (startval + seedsLeft > map.destination + map.range) {
            seedsLeft = seedsLeft - (map.destination + map.range - startval);
            result.push({
                from: startval,
                to: map.destination + map.range,
                startValue: startval,
            });
            startingSeed = startingSeed + (map.destination + map.range - startingSeed);
            continue;
        }
        result.push({
            from: startval,
            to: startval + seedsLeft,
            startValue: startval,
        });
        seedsLeft = 0;
    }
    return result;
};

type Seed = {
    value: number;
    range: number;
    soil?: RangeMap[];
    fertilizer?: RangeMap[];
    water?: RangeMap[];
    light?: RangeMap[];
    temperature?: RangeMap[];
    humidity?: RangeMap[];
    location?: RangeMap[];
};

type RangeMap = {
    from: number;
    to: number;
    startValue: number;
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

for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    // console.log(seed);

    // from seed to soil
    const soilmap = maps.filter((x) => x.from === 'seed' && x.to === 'soil');
    const soilRangeMaps = getRangeMaps(soilmap, seed.value, seed.range);
    seed.soil = soilRangeMaps;

    // from soil to fertilizer
    const fertilizermap = maps.filter((x) => x.from === 'soil' && x.to === 'fertilizer');

    for (let j = 0; j < soilRangeMaps.length; j++) {
        const soilRangeMap = soilRangeMaps[j];
        const fertilizerRangeMaps = getRangeMaps(fertilizermap, soilRangeMap.startValue, soilRangeMap.to - soilRangeMap.startValue);
        if (!seed.fertilizer) {
            seed.fertilizer = [];
        }
        seed.fertilizer = seed.fertilizer.concat(fertilizerRangeMaps);
    }

    if (!seed.fertilizer) {
        seed.fertilizer = [];
    }
    // from fertilizer to water
    const watermap = maps.filter((x) => x.from === 'fertilizer' && x.to === 'water');

    for (let j = 0; j < seed.fertilizer.length; j++) {
        const fertilizerRangeMap = seed.fertilizer[j];
        const waterRangeMaps = getRangeMaps(watermap, fertilizerRangeMap.startValue, fertilizerRangeMap.to - fertilizerRangeMap.from);
        if (!seed.water) {
            seed.water = [];
        }
        seed.water = seed.water.concat(waterRangeMaps);
    }

    if (!seed.water) {
        seed.water = [];
    }

    // from water to light
    const lightmap = maps.filter((x) => x.from === 'water' && x.to === 'light');

    for (let j = 0; j < seed.water.length; j++) {
        const waterRangeMap = seed.water[j];
        const lightRangeMaps = getRangeMaps(lightmap, waterRangeMap.startValue, waterRangeMap.to - waterRangeMap.from);
        if (!seed.light) {
            seed.light = [];
        }
        seed.light = seed.light.concat(lightRangeMaps);
    }

    if (!seed.light) {
        seed.light = [];
    }

    // from light to temperature
    const temperaturemap = maps.filter((x) => x.from === 'light' && x.to === 'temperature');

    for (let j = 0; j < seed.light.length; j++) {
        const lightRangeMap = seed.light[j];
        const temperatureRangeMaps = getRangeMaps(temperaturemap, lightRangeMap.startValue, lightRangeMap.to - lightRangeMap.from);
        if (!seed.temperature) {
            seed.temperature = [];
        }
        seed.temperature = seed.temperature.concat(temperatureRangeMaps);
    }

    if (!seed.temperature) {
        seed.temperature = [];
    }

    // from temperature to humidity
    const humiditymap = maps.filter((x) => x.from === 'temperature' && x.to === 'humidity');

    for (let j = 0; j < seed.temperature.length; j++) {
        const temperatureRangeMap = seed.temperature[j];
        const humidityRangeMaps = getRangeMaps(humiditymap, temperatureRangeMap.startValue, temperatureRangeMap.to - temperatureRangeMap.from);
        if (!seed.humidity) {
            seed.humidity = [];
        }
        seed.humidity = seed.humidity.concat(humidityRangeMaps);
    }

    if (!seed.humidity) {
        seed.humidity = [];
    }

    // from humidity to location
    const locationmap = maps.filter((x) => x.from === 'humidity' && x.to === 'location');

    for (let j = 0; j < seed.humidity.length; j++) {
        const humidityRangeMap = seed.humidity[j];
        const locationRangeMaps = getRangeMaps(locationmap, humidityRangeMap.startValue, humidityRangeMap.to - humidityRangeMap.from);
        if (!seed.location) {
            seed.location = [];
        }
        seed.location = seed.location.concat(locationRangeMaps);
    }

}

const sortByStartValue = (a: RangeMap, b: RangeMap) => {
    return a.startValue - b.startValue;
};

// find seed with lowest location value
let lowest = seeds.sort((a, b) => {
    if (!a.location || !b.location) {
        return 0;
    }
    const aLocation = a.location.sort(sortByStartValue)[0];
    const bLocation = b.location.sort(sortByStartValue)[0];
    return aLocation.startValue - bLocation.startValue;
})[0];

if (!lowest.location) {
    console.log('no location found');
    process.exit(1);
}
const lowestVal = lowest.location.sort(sortByStartValue)[0].startValue;

console.dir(lowest, { depth: 10 });
console.log('Answer:', lowestVal);
