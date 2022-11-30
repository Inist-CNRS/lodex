import React from 'react';
import PropTypes from 'prop-types';
import {
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
} from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FormatCatalogDialog from './FormatCatalog';

const SelectFormat = ({ formats, value, onChange, p: polyglot }) => {
    const [openCatalog, setOpenCatalog] = React.useState(false);
    return (
        <div style={{ display: 'flex' }}>
            <FormControl fullWidth>
                <InputLabel id="select-form-input-label">
                    {polyglot.t('select_a_format')}
                </InputLabel>
                <Select
                    className="select-format"
                    labelId="select-form-input-label"
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    autoWidth
                >
                    <MenuItem value="None">{'None'}</MenuItem>
                    {formats
                        .sort((x, y) =>
                            polyglot
                                .t(x.name)
                                .localeCompare(polyglot.t(y.name)),
                        )
                        .map(format => (
                            <MenuItem
                                className="select-format-item"
                                key={format.name}
                                value={format.componentName}
                            >
                                {polyglot.t(format.name)}
                                <div data-value={format.componentName} />
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <div style={{ margin: '10px 0px 0px 10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCatalog(true)}
                >
                    <ListAltIcon fontSize="small" />
                </Button>
            </div>
            <FormatCatalogDialog
                isOpen={openCatalog}
                handleClose={() => setOpenCatalog(false)}
                formats={formats}
                onChange={onChange}
            />
        </div>
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
