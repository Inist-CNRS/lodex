import { get } from 'lodash';
import documentationByOperation from './documentationByOperation';

const isUndefinedOrEmpty = (value) =>
    typeof value === 'undefined' || value === '';

const getLabelColumn = (preComputation, labelColumn) => {
    if (!isUndefinedOrEmpty(labelColumn)) {
        return labelColumn;
    }

    if (
        ['segments-precomputed', 'segments-precomputed-nofilter'].includes(
            preComputation,
        )
    ) {
        return 'source';
    }
    return 'id';
};

const getValueColumn = (preComputation, valueColumn) => {
    if (!isUndefinedOrEmpty(valueColumn)) {
        return valueColumn;
    }

    if (
        ['segments-precomputed', 'segments-precomputed-nofilter'].includes(
            preComputation,
        )
    ) {
        return 'weight';
    }
    return 'value';
};

const getQueryParameters = (preComputation, labelColumn, valueColumn) => {
    return `?precomputedName=${preComputation}&precomputedValueColumn=${getValueColumn(preComputation, valueColumn)}&precomputedLabelColumn=${getLabelColumn(preComputation, labelColumn)}`;
};

const transformation = (_, args) => () =>
    new Promise((resolve, reject) => {
        const precomputedArg = args.find((a) => a.name === 'precomputed');

        if (!precomputedArg || isUndefinedOrEmpty(precomputedArg.value)) {
            return reject(
                new Error('Invalid Argument for PRECOMPUTED transformation'),
            );
        }

        const precomputedLabelColumnArg = args.find(
            (a) => a.name === 'precomputedLabelColumn',
        ) ?? { value: 'id' };

        const precomputedValueColumnArg = args.find(
            (a) => a.name === 'precomputedValueColumn',
        ) ?? { value: 'value' };

        const routineArg = args.find((a) => a.name === 'routine');

        if (!routineArg || isUndefinedOrEmpty(routineArg.value)) {
            return reject(
                new Error('Invalid Argument for PRECOMPUTED transformation'),
            );
        }

        return resolve(
            `${routineArg.value}${getQueryParameters(
                precomputedArg.value,
                precomputedLabelColumnArg.value,
                precomputedValueColumnArg.value,
            )}`,
        );
    });

transformation.getMetas = () => ({
    name: 'PRECOMPUTED',
    type: 'value',
    args: [
        {
            name: 'precomputed',
            type: 'string',
        },
        {
            name: 'precomputedLabelColumn',
            type: 'string',
        },
        {
            name: 'precomputedValueColumn',
            type: 'string',
        },
        {
            name: 'routine',
            type: 'string',
        },
    ],
    docUrl: documentationByOperation['PRECOMPUTED'],
});

export default transformation;
