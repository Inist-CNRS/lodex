import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';

import ListDialog from './ListDialog';
import { fromUpload } from '../selectors';
import { openUpload, closeUpload } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        color: 'white',
        marginLeft: 4,
        marginRight: 4,
    },
};

const LoaderSelectComponent = ({
    open,
    label,
    raised,
    handleOpen,
    handleClose,
    p: polyglot,
}) => {
    const actions = [
        <FlatButton
            key="cancel"
            secondary
            label={polyglot.t('cancel')}
            onClick={handleClose}
        />,
    ];

    return (
        <span>
            {raised ? (
                <RaisedButton
                    style={styles.button}
                    className="open-upload"
                    icon={<ArchiveIcon />}
                    label={label}
                    primary
                    onClick={handleOpen}
                />
            ) : (
                <FlatButton
                    style={styles.button}
                    className="open-upload"
                    label={label}
                    primary
                    onClick={handleOpen}
                />
            )}
            <ListDialog
                actions={actions}
                open={open}
                handleClose={handleClose}
            />
        </span>
    );
};

LoaderSelectComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    raised: PropTypes.bool,
    label: PropTypes.string.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

LoaderSelectComponent.defaultProps = {
    raised: false,
};

const mapStateToProps = state => ({
    open: fromUpload.isOpen(state),
    saving: fromUpload.isUploadPending(state),
});

const mapDispatchToProps = {
    handleOpen: openUpload,
    handleClose: closeUpload,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(LoaderSelectComponent);
