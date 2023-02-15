import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Button } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';

export const ParsingExcerptAddColumnComponent = ({
    handleAddColumn,
    name,
    p: polyglot,
    atTop,
    isFieldsLoading,
}) => (
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
        {polyglot.t('add_to_publication')}
    </Button>
);

ParsingExcerptAddColumnComponent.propTypes = {
    atTop: PropTypes.bool.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    p: polyglotPropTypes.isRequired,
    isFieldsLoading: PropTypes.bool,
};

ParsingExcerptAddColumnComponent.defaultProps = {
    style: null,
};

const mapStateToProps = state => ({
    isFieldsLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleAddColumn: ({ name, onAddColumn }) => () => onAddColumn(name),
    }),
    translate,
)(ParsingExcerptAddColumnComponent);
