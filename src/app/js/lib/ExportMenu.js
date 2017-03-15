import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import memoize from 'lodash.memoize';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { exportPublishedDataset as exportPublishedDatasetAction } from '../public/export';
import config from '../../../../config.json';
import ExportMenuItem from './ExportMenuItem';

const styles = {
    icon: {
        color: 'white',
    },
};

const origin = { horizontal: 'right', vertical: 'top' };

const getStyles = memoize(style => Object.assign({}, styles.icon, style));

export const ExportMenuComponent = ({ handleExportClick, iconStyle, p: polyglot }) => (
    <IconMenu
        iconStyle={getStyles(iconStyle)}
        iconButtonElement={
            <IconButton tooltip={polyglot.t('export_data')}><FileDownloadIcon /></IconButton>
        }
        targetOrigin={origin}
        anchorOrigin={origin}
    >
        {
            config.exporters.map(type => (
                <ExportMenuItem
                    key={type}
                    type={type}
                    onClick={handleExportClick}
                />
            ))
        }
    </IconMenu>
);

ExportMenuComponent.propTypes = {
    handleExportClick: PropTypes.func.isRequired,
    iconStyle: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
};

ExportMenuComponent.defaultProps = {
    iconStyle: null,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    handleExportClick: exportPublishedDatasetAction,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(ExportMenuComponent);
