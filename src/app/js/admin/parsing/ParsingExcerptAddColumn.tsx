import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Button } from '@mui/material';

import { fromFields } from '../../sharedSelectors';
import { useTranslate } from '../../i18n/I18NContext';

export const ParsingExcerptAddColumnComponent = ({
    // @ts-expect-error TS7031
    handleAddColumn,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    atTop,
    // @ts-expect-error TS7031
    isFieldsLoading,
}) => {
    const { translate } = useTranslate();
    return (
        <Button
            variant="contained"
            className={`btn-excerpt-add-column btn-excerpt-add-column-${name.replace(
                ' ',
                '-',
            )}`}
            onClick={handleAddColumn}
            color="primary"
            disabled={isFieldsLoading}
            sx={{
                bottom: atTop ? '0' : '-50%',
                transform: atTop ? 'translateY(0)' : 'translateY(50%)',
                position: 'absolute',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80%',
                display: 'flex',
                zIndex: 1,
            }}
        >
            {translate('add_to_publication')}
        </Button>
    );
};

ParsingExcerptAddColumnComponent.propTypes = {
    atTop: PropTypes.bool.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    isFieldsLoading: PropTypes.bool,
};

ParsingExcerptAddColumnComponent.defaultProps = {
    style: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    isFieldsLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleAddColumn:
            // @ts-expect-error TS7031


                ({ name, onAddColumn }) =>
                () =>
                    onAddColumn(name),
    }),
    // @ts-expect-error TS2345
)(ParsingExcerptAddColumnComponent);
