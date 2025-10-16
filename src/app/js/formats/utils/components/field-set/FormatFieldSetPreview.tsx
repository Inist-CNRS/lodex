import { lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatAdminStyle } from '../../adminStyles';
import { AllDataSets } from '../../dataSet';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Loading from '../../../../lib/components/Loading';
import { useTranslate } from '../../../../i18n/I18NContext';
import type { InteractionProps } from 'react-json-view';

const ReactJson = lazy(() => import('react-json-view'));

type FormatFieldSetPreviewProps = {
    args: Record<string, unknown>;
    showDatasetsSelector?: boolean;
    datasets: {
        name: string;
        total: number;
        values: unknown;
    }[];
    PreviewComponent: React.JSXElementConstructor<{
        dataset: unknown;
    }>;
    defaultExpanded?: boolean;
};

const FormatFieldSetPreview = ({
    args,
    showDatasetsSelector,
    datasets,
    PreviewComponent,
    defaultExpanded,
}: FormatFieldSetPreviewProps) => {
    const { translate } = useTranslate();

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

    const handleDataSetChange = (event: SelectChangeEvent<string>) => {
        setDatasetName(event.target.value);
    };

    const handleDataSetEditor = (event: InteractionProps) => {
        setDataset(event.updated_src);
    };

    return (
        <Accordion defaultExpanded={defaultExpanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="format-field-set-preview"
                id="format-field-set-preview"
            >
                <Typography>{translate('format_preview')}</Typography>
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

export default FormatFieldSetPreview;
