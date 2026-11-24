export const precomputed = (routine: string) => [
    {
        operation: 'PRECOMPUTED',
        args: [
            { name: 'precomputed', value: 'vector' },
            { name: 'routine', value: routine },
        ],
    },
];
