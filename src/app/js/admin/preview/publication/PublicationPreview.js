import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from '../../../fields/wizard';
import { editField, loadField } from '../../../fields';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
    },
    content: {
        overflow: 'auto',
    },
    titleContainer: {
        alignSelf: 'center',
        flexGrow: 0,
        flexShrink: 0,
        width: 50,
    },
    title: {
        textTransform: 'uppercase',
        transform: 'rotate(-90deg)',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class PublicationPreviewComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }
    handleExitColumEdition = event => {
        event.preventDefault();
        event.stopPropagation();
        this.props.editColumn(null);
    };

    render() {
        const { editColumn, p: polyglot } = this.props;

        return (
            <div style={styles.container} className="publication-preview">
                <div style={styles.titleContainer}>
                    <div style={styles.title}>
                        {polyglot.t('publication_preview')}
                    </div>
                </div>

                <PublicationExcerpt onHeaderClick={editColumn} />

                <PublicationEditionModal
                    onExitEdition={this.handleExitColumEdition}
                />
            </div>
        );
    }
}

PublicationPreviewComponent.propTypes = {
    editColumn: PropTypes.func.isRequired,
    loadField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    editColumn: editField,
    loadField,
};

export default compose(connect(null, mapDispatchToProps), translate)(
    PublicationPreviewComponent,
);
