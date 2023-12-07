export const StandardIdValue = {
    name: 'Standard - _id / value',
    values: [
        { _id: 'A', value: 28 },
        { _id: 'B', value: 55 },
        { _id: 'C', value: 43 },
    ],
};

export const StandardSourceTargetWeight = {
    name: 'Standard - source / target / weight',
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
    values: [
        { _id: 'JPN', value: 28 },
        { _id: 'GBR', value: 55 },
        { _id: 'CAN', value: 43 },
        { _id: 'TUN', value: 15 },
    ],
};

export const MapFranceIdValue = {
    name: 'Map France - _id / value',
    values: [
        { _id: 'FR.VG', value: 28 },
        { _id: 'FR.MM', value: 55 },
        { _id: 'FR.HM', value: 15 },
    ],
};

export const AllDataSets = [
    StandardIdValue,
    StandardSourceTargetWeight,
    MapSourceTargetWeight,
    MapIdValue,
    MapFranceIdValue,
];
