import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithDialog from '../../lib/components/ButtonWithDialog';
import { getCleanHost } from '../../../../common/uris';

class EmbedButton extends Component {
    state = { open: false };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    renderOpenButton = () => {
        const { className, p: polyglot } = this.props;

        return (
            <IconButton
                className={classnames('embed-button', className)}
                style={{ position: 'absolute' }}
                tooltip={polyglot.t('embed_istex_summary')}
                onClick={this.handleOpen}
            >
                <CodeIcon />
            </IconButton>
        );
    };

    renderDialog = () => {
        const { uri, fieldName, p: polyglot } = this.props;
        const host = getCleanHost();

        return (
            <Fragment>
                <p>{polyglot.t('embed_step_head')}</p>
                <pre>
                    {`<script src="${host}/embeddedIstexSummary.js" defer></script>`}
                </pre>
                <p>{polyglot.t('embed_step_div')}</p>
                <pre>
                    {`<div class="embedded-istex-summary" data-api="${host}" data-uri="${uri}" data-field-name="${fieldName}"></div>`}
                </pre>
            </Fragment>
        );
    };

    render() {
        const { p: polyglot } = this.props;
        const { open } = this.state;

        return (
            <ButtonWithDialog
                label={polyglot.t('embed_istex_summary')}
                open={open}
                handleOpen={this.handleOpen}
                handleClose={this.handleClose}
                openButton={this.renderOpenButton()}
                dialog={this.renderDialog()}
            />
        );
    }
}

EmbedButton.propTypes = {
    className: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
};

EmbedButton.defaultProps = {
    className: null,
};

export default EmbedButton;
