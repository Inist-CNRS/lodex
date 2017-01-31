import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';

import ParsingExcerpt from '../parsing/ParsingExcerpt';
import { getPublicationColumns, addField, editField } from '../fields';
import { polyglot as polyglotPropTypes } from '../../lib/propTypes';


export const PublicationPreviewComponent = ({ columns, lines, addColumn, editColumn, p: polyglot }) => (
    <div>
        <FlatButton label={polyglot.t('add column')} onClick={addColumn} />
        <ParsingExcerpt columns={columns} lines={lines} onHeaderClick={editColumn} />
    </div>
);

PublicationPreviewComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    addColumn: PropTypes.func.isRequired,
    editColumn: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    columns: getPublicationColumns(state),
    lines: state.publicationPreview,
});

const mapDispatchToProps = {
    addColumn: addField,
    editColumn: editField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
