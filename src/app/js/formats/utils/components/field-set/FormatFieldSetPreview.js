import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { formatAdminStyle } from '../../adminStyles';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { AllDataSets } from '../../dataSet';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FormatFieldSetPreview = ({
    p,
    args,
    showDatasetsSelector,
    datasets,
    PreviewComponent,
    defaultExpanded,
}) => {
    const ReactJson = require('react-json-view').default;

    const [datasetName, setDatasetName] = useState('');
    const [dataset, setDataset] = useState({});

    useEffect(() => {
        if (datasets && datasets.length >= 1) {
            setDatasetName(datasets[0].name);
        }
    }, [datasets]);

    useEffect(() => {
        const newSet = datasets.find((value) => value.name === datasetName);
        if (!newSet) {
            setDataset({});
            return;
        }
        setDataset({
            total: newSet.total,
            values: newSet.values,
        });
    }, [datasets, datasetName]);

    const handleDataSetChange = (event) => {
        setDatasetName(event.target.value);
    };

    const handleDataSetEditor = (event) => {
        setDataset(event.updated_src);
    };

    return (
        <Accordion defaultExpanded={defaultExpanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="format-field-set-preview"
                id="format-field-set-preview"
            >
                {p.t('format_preview')}
            </AccordionSummary>
            <AccordionDetails>
                {showDatasetsSelector ? (
                    <Select
                        style={{
                            width: '100%',
                            marginBottom: '12px',
                        }}
                        value={datasetName}
                        onChange={handleDataSetChange}
                    >
                        {datasets.map((set) => (
                            <MenuItem key={set.name} value={set.name}>
                                {set.name}
                            </MenuItem>
                        ))}
                    </Select>
                ) : null}
                <fieldset
                    style={{
                        borderRadius: formatAdminStyle.fieldset.borderRadius,
                    }}
                >
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
                    collapsed={1}
                />
            </AccordionDetails>
        </Accordion>
    );
};

FormatFieldSetPreview.defaultProps = {
    showDatasetsSelector: true,
    datasets: AllDataSets,
    defaultExpanded: false,
};

FormatFieldSetPreview.propTypes = {
    p: polyglotPropTypes.isRequired,
    args: PropTypes.any.isRequired,
    showDatasetsSelector: PropTypes.bool,
    defaultExpanded: PropTypes.bool,
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            values: PropTypes.any.isRequired,
        }),
    ),
    PreviewComponent: PropTypes.element.isRequired,
};

export default translate(FormatFieldSetPreview);
