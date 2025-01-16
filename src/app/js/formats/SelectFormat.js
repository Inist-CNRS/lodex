import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button, TextField, Box } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FormatCatalogDialog from './FormatCatalog';

const SelectFormat = ({ formats, value, onChange, p: polyglot }) => {
    const [openCatalog, setOpenCatalog] = React.useState(false);
    return (
        <Box sx={{ display: 'flex' }}>
            <TextField
                select
                className="select-format"
                label={polyglot.t('select_a_format')}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                fullWidth
            >
                <MenuItem value="">{polyglot.t('none')}</MenuItem>
                {formats.map((format) => (
                    <MenuItem
                        className="select-format-item"
                        key={format.name}
                        value={format.componentName}
                    >
                        {polyglot.t(format.name)}
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

SelectFormat.defaultProps = {
    value: null,
};

SelectFormat.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(SelectFormat);
