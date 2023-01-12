import React from 'react';
import PropTypes from 'prop-types';
import { Switch, TextField, FormControlLabel, Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '..';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { useParams } from 'react-router';
import { SCOPE_GRAPHIC } from '../../../../common/scope';
import ListAltIcon from '@material-ui/icons/ListAlt';
import RoutineCatalogDialog from './RoutineCatalog';

const styles = {
    inset: {
        paddingLeft: 40,
        display: 'flex',
        alignItems: 'center',
    },
};

export const TabValueValueComponent = ({
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
    value,
}) => {
    const { filter: scopeForm } = useParams();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    return (
        <div id="tab-value-value">
            <FormControlLabel
                control={
                    <Switch
                        className="radio_value"
                        value="value"
                        onChange={handleSelect}
                        checked={selected}
                    />
                }
                label={polyglot.t('a_value')}
            />
            {selected && (
                <div style={styles.inset}>
                    <TextField
                        id="textbox_value"
                        fullWidth
                        placeholder={polyglot.t('enter_a_value')}
                        onChange={handleChange}
                        value={value}
                    />
                    {scopeForm === SCOPE_GRAPHIC && (
                        <>
                            <div style={{ marginLeft: '10px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenCatalog(true)}
                                >
                                    <ListAltIcon fontSize="small" />
                                </Button>
                            </div>
                            <RoutineCatalogDialog
                                isOpen={openCatalog}
                                handleClose={() => setOpenCatalog(false)}
                                onChange={handleChange}
                                currentValue={value}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

TabValueValueComponent.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    value: PropTypes.string,
};
TabValueValueComponent.defaultProps = {
    value: undefined,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'VALUE'
            ? transformers[0]
            : null;

    if (valueTransformer) {
        return {
            selected: true,
            value:
                (valueTransformer.args &&
                    valueTransformer.args[0] &&
                    valueTransformer.args[0].value) ||
                '',
        };
    }

    return { selected: false, value: null };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange, value }) => () => {
            onChange([
                {
                    operation: 'VALUE',
                    args: [
                        {
                            name: 'value',
                            type: 'string',
                            value,
                        },
                    ],
                },
            ]);
        },
        handleChange: ({ onChange }) => event => {
            onChange([
                {
                    operation: 'VALUE',
                    args: [
                        {
                            name: 'value',
                            type: 'string',
                            value: event.target.value,
                        },
                    ],
                },
            ]);
        },
    }),
    translate,
)(TabValueValueComponent);
