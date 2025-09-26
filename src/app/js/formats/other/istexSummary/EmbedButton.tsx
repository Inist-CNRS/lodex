import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import ButtonWithDialog from '../../../lib/components/ButtonWithDialog';
import { getCleanHost } from '../../../../../common/uris';

class EmbedButton extends Component {
    state = { open: false };

    handleOpen = () => this.setState({ open: true });
    handleClose = () => this.setState({ open: false });

    renderOpenButton = () => {
        // @ts-expect-error TS2339
        const { className, p: polyglot } = this.props;

        return (
            // @ts-expect-error TS2769
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
        // @ts-expect-error TS2339
        const { uri, fieldName, p: polyglot } = this.props;
        const host = getCleanHost();

        return (
            <>
                <p>{polyglot.t('embed_step_head')}</p>
                <pre>
                    {`<script src="${host}/embeddedIstexSummary.js" defer></script>`}
                </pre>
                <p>{polyglot.t('embed_step_div')}</p>
                <pre>
                    {`<div class="embedded-istex-summary" data-api="${host}" data-uri="${uri}" data-field-name="${fieldName}"></div>`}
                </pre>
            </>
        );
    };

    render() {
        // @ts-expect-error TS2339
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

// @ts-expect-error TS2339
EmbedButton.propTypes = {
    className: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
};

// @ts-expect-error TS2339
EmbedButton.defaultProps = {
    className: null,
};

export default EmbedButton;
