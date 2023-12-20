import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { formatAdminStyle } from '../adminStyles';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { MenuItem, Select } from '@mui/material';
import { AllDataSets } from '../dataSet';

const VegaFieldPreview = ({
    p,
    args,
    showDatasetsSelector,
    datasets,
    PreviewComponent,
}) => {
    const ReactJson = require('react-json-view').default;

    const [datasetName, setDatasetName] = useState(datasets[0].name);
    const [dataset, setDataset] = useState({});

    useEffect(() => {
        const newSet = datasets.find(value => value.name === datasetName);
        setDataset({
            values: newSet.values,
        });
    }, [datasetName]);

    const handleDataSetChange = event => {
        setDatasetName(event.target.value);
    };

    const handleDataSetEditor = event => {
        setDataset(event.updated_src);
    };

    return (
        <fieldset style={formatAdminStyle.fieldset}>
            <legend style={formatAdminStyle.legend}>
                {p.t('format_preview')}
            </legend>
            {showDatasetsSelector ? (
                <Select
                    style={{
                        width: '100%',
                        marginBottom: '12px',
                    }}
                    value={datasetName}
                    onChange={handleDataSetChange}
                >
                    {datasets.map(set => (
                        <MenuItem key={set.name} value={set.name}>
                            {set.name}
                        </MenuItem>
                    ))}
                </Select>
            ) : null}
            <fieldset style={{ borderRadius: '5px' }}>
                <PreviewComponent {...args} dataset={dataset} />
            </fieldset>
            <ReactJson
                style={{
                    borderRadius: '5px',
                    padding: '8px',
                    marginTop: '12px',
                }}
                src={dataset}
                theme="monokai"
                enableClipboard={false}
                onEdit={handleDataSetEditor}
                onAdd={handleDataSetEditor}
                onDelete={handleDataSetEditor}
            />
        </fieldset>
    );
};

VegaFieldPreview.defaultProps = {
    showDatasetsSelector: true,
    datasets: AllDataSets,
};

VegaFieldPreview.propTypes = {
    p: polyglotPropTypes.isRequired,
    args: PropTypes.any.isRequired,
    showDatasetsSelector: PropTypes.bool,
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            values: PropTypes.any.isRequired,
        }),
    ),
    PreviewComponent: PropTypes.element.isRequired,
};

export default translate(VegaFieldPreview);
