import React, { lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatAdminStyle } from '../../adminStyles';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { AllDataSets } from '../../dataSet';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Loading from '../../../../lib/components/Loading';
import { translate, useTranslate } from '../../../../i18n/I18NContext';

const ReactJson = lazy(() => import('react-json-view'));

const FormatFieldSetPreview = ({
    // @ts-expect-error TS7031
    p,
    // @ts-expect-error TS7031
    args,
    // @ts-expect-error TS7031
    showDatasetsSelector,
    // @ts-expect-error TS7031
    datasets,
    // @ts-expect-error TS7031
    PreviewComponent,
    // @ts-expect-error TS7031
    defaultExpanded,
}) => {
    const { translate } = useTranslate();

    const [datasetName, setDatasetName] = useState('');
    const [dataset, setDataset] = useState({});

    useEffect(() => {
        if (datasets && datasets.length >= 1) {
            setDatasetName(datasets[0].name);
        }
    }, [datasets]);

    useEffect(() => {
        // @ts-expect-error TS7006
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

    // @ts-expect-error TS7006
    const handleDataSetChange = (event) => {
        setDatasetName(event.target.value);
    };

    // @ts-expect-error TS7006
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
                <Typography>{p.t('format_preview')}</Typography>
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
                        {/*
                         // @ts-expect-error TS7006 */}
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
                <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
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
                </Suspense>
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
