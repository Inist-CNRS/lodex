import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportPublishedDataset as exportPublishedDatasetAction } from '../../public/export';
import config from '../../../../../config.json';

const styles = {
    icon: {
        color: 'white',
    },
};

const origin = { horizontal: 'right', vertical: 'top' };

export const ExportMenuComponent = ({ exportPublishedDataset, p: polyglot, ...props }) => (
    <IconMenu
        {...props}
        iconStyle={styles.icon}
        iconButtonElement={
            <IconButton tooltip={polyglot.t('export_data')}><FileDownloadIcon /></IconButton>
        }
        targetOrigin={origin}
        anchorOrigin={origin}
    >
        {
            config.exporters.map(type => (
                <MenuItem
                    key={type}
                    className="btn-export"
                    primaryText={polyglot.t('export', { type })}
                    onClick={() => exportPublishedDataset(type)}
                />
            ))
        }
    </IconMenu>
);

ExportMenuComponent.propTypes = {
    exportPublishedDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    exportPublishedDataset: exportPublishedDatasetAction,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(ExportMenuComponent);
