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
        { source: 'FRA', target: 'JPN', weight: 28 },
        { source: 'FRA', target: 'GBR', weight: 55 },
        { source: 'FRA', target: 'CAN', weight: 43 },
        { source: 'FRA', target: 'TUN', weight: 15 },
    ],
};
