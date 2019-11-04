import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import withWidth from 'material-ui/utils/withWidth';
import ExportIcon from 'material-ui/svg-icons/editor/vertical-align-bottom';
import translate from 'redux-polyglot/translate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classnames from 'classnames';

import stylesToClassname from '../lib/stylesToClassName';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromExport } from './selectors';
import {
    preLoadExporters,
    exportPublishedDataset as exportPublishedDatasetAction,
} from './export';

import ExportItem from './export/ExportMenuItem';

const styles = stylesToClassname(
    {
        button: {},
    },
    'export',
);

class ExportButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleClick = event => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const {
            exporters,
            handleExportClick,
            uri,
            p: polyglot,
            width,
        } = this.props;
        if (!exporters || !exporters.length) {
            return null;
        }

        const exportLabel = uri ? 'export_resource' : 'export_resultset';
        const label = width > 1 ? polyglot.t(exportLabel) : '';

        return (
            <>
                <FlatButton
                    primary
                    onClick={this.handleClick}
                    label={label}
                    icon={<ExportIcon />}
                    className={classnames('export', styles.button)}
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu>
                        {exporters.map(({ name }) => (
                            <ExportItem
                                key={name}
                                type={name}
                                uri={uri}
                                onClick={handleExportClick}
                            />
                        ))}
                    </Menu>
                </Popover>
            </>
        );
    }
}

ExportButton.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    handleExportClick: PropTypes.func.isRequired,
    preLoadExporters: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string,
    width: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    exporters: fromExport.getExporters(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            preLoadExporters,
            handleExportClick: exportPublishedDatasetAction,
        },
        dispatch,
    );

export default compose(
    withWidth(),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(ExportButton);
