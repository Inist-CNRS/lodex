export const StandardText = {
    name: 'Standard - Text',
    total: 1,
    values: 'Hello, LODEX',
};

export const StandardNumber = {
    name: 'Standard - Number',
    total: 1,
    values: 314159265359,
};

export const StandardIdValue = {
    name: 'Standard - _id / value',
    total: 3,
    values: [
        { _id: 'A', value: 28 },
        { _id: 'B', value: 55 },
        { _id: 'C', value: 43 },
    ],
};

export const StandardSourceTargetWeight = {
    name: 'Standard - source / target / weight',
    total: 9,
    values: [
        { source: 'A', target: 'A', weight: 28 },
        { source: 'A', target: 'B', weight: 55 },
        { source: 'A', target: 'C', weight: 43 },
        { source: 'B', target: 'A', weight: 15 },
        { source: 'B', target: 'B', weight: 68 },
        { source: 'B', target: 'C', weight: 45 },
        { source: 'C', target: 'A', weight: 85 },
        { source: 'C', target: 'B', weight: 32 },
        { source: 'C', target: 'C', weight: 17 },
    ],
};

export const MapSourceTargetWeight = {
    name: 'Map - source / target / weight',
    total: 13,
    values: [
        // Points
        { source: 'FRA', target: 'FRA', weight: 18 },
        { source: 'JPN', target: 'JPN', weight: 28 },
        { source: 'GBR', target: 'GBR', weight: 55 },
        { source: 'CAN', target: 'CAN', weight: 43 },
        { source: 'TUN', target: 'TUN', weight: 15 },
        // Link right to left
        { source: 'FRA', target: 'JPN', weight: 28 },
        { source: 'FRA', target: 'GBR', weight: 55 },
        { source: 'FRA', target: 'CAN', weight: 43 },
        { source: 'FRA', target: 'TUN', weight: 15 },
        // Link left to right
        { source: 'JPN', target: 'FRA', weight: 28 },
        { source: 'GBR', target: 'FRA', weight: 55 },
        { source: 'CAN', target: 'FRA', weight: 43 },
        { source: 'TUN', target: 'FRA', weight: 15 },
    ],
};

export const MapIdValue = {
    name: 'Map - _id / value',
    total: 4,
    values: [
        { _id: 'JPN', value: 28 },
        { _id: 'GBR', value: 55 },
        { _id: 'CAN', value: 43 },
        { _id: 'TUN', value: 15 },
    ],
};

export const MapFranceIdValue = {
    name: 'Map France - _id / value',
    total: 3,
    values: [
        { _id: 'FR.VG', value: 28 },
        { _id: 'FR.MM', value: 55 },
        { _id: 'FR.HM', value: 15 },
    ],
};

export const TreeMapSourceTargetWeight = {
    name: 'Tree Map - source / target / weight',
    total: 24,
    values: [
        { source: 'A', target: 'B', weight: 193 },
        { source: 'B', target: 'BA', weight: 15 },
        { source: 'B', target: 'BB', weight: 52 },
        { source: 'B', target: 'BC', weight: 67 },
        { source: 'B', target: 'BD', weight: 3 },
        { source: 'B', target: 'BE', weight: 24 },
        { source: 'B', target: 'BF', weight: 32 },

        { source: 'A', target: 'C', weight: 87 },
        { source: 'C', target: 'CA', weight: 12 },
        { source: 'C', target: 'CB', weight: 36 },
        { source: 'C', target: 'CC', weight: 29 },
        { source: 'C', target: 'CD', weight: 10 },

        { source: 'A', target: 'D', weight: 204 },
        { source: 'D', target: 'DA', weight: 21 },
        { source: 'D', target: 'DB', weight: 35 },
        { source: 'D', target: 'DC', weight: 42 },
        { source: 'D', target: 'DD', weight: 11 },
        { source: 'D', target: 'DE', weight: 56 },
        { source: 'D', target: 'DF', weight: 39 },

        { source: 'A', target: 'E', weight: 174 },
        { source: 'E', target: 'EA', weight: 23 },
        { source: 'EA', target: 'EAA', weight: 36 },
        { source: 'EA', target: 'EAB', weight: 46 },
        { source: 'E', target: 'EB', weight: 69 },
    ],
};

export const AllDataSets = [
    StandardText,
    StandardNumber,
    StandardIdValue,
    StandardSourceTargetWeight,
    MapSourceTargetWeight,
    MapIdValue,
    MapFranceIdValue,
    TreeMapSourceTargetWeight,
];
