import React from 'react';
import { MenuItem, Button, TextField, Box } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormatCatalogDialog, { type FormatProps } from './FormatCatalog';
import { useTranslate } from '../i18n/I18NContext';

interface SelectFormatProps {
    formats: FormatProps[];
    value?: string;
    onChange(value: string): void;
}

const SelectFormat = ({ formats, value, onChange }: SelectFormatProps) => {
    const { translate } = useTranslate();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    return (
        <Box sx={{ display: 'flex' }}>
            <TextField
                select
                className="select-format"
                label={translate('select_a_format')}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                fullWidth
            >
                <MenuItem value="">{translate('none')}</MenuItem>
                {formats.map((format) => (
                    <MenuItem
                        className="select-format-item"
                        key={format.name}
                        value={format.componentName}
                    >
                        {translate(format.name)}
                        <div data-value={format.componentName} />
                    </MenuItem>
                ))}
            </TextField>
            <Box sx={{ marginLeft: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCatalog(true)}
                    sx={{ height: '100%' }}
                >
                    <ListAltIcon fontSize="medium" />
                </Button>
            </Box>
            <FormatCatalogDialog
                isOpen={openCatalog}
                handleClose={() => setOpenCatalog(false)}
                formats={formats}
                onChange={onChange}
                currentValue={value}
            />
        </Box>
    );
};

export default SelectFormat;
