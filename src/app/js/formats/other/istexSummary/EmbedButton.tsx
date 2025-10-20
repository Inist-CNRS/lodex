// @ts-expect-error TS6133
import React, { Component } from 'react';
import { IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import ButtonWithDialog from '../../../lib/components/ButtonWithDialog';
import { getCleanHost } from '../../../../../common/uris';

interface EmbedButtonProps {
    className?: string;
    p: unknown;
    uri: string;
    fieldName: string;
}

class EmbedButton extends Component<EmbedButtonProps> {
    state = { open: false };

    handleOpen = () => this.setState({ open: true });
    handleClose = () => this.setState({ open: false });

    renderOpenButton = () => {
        const { className, p: polyglot } = this.props;

        return (
            // @ts-expect-error TS2769
            (<IconButton
                className={classnames('embed-button', className)}
                style={{ position: 'absolute' }}
                tooltip={polyglot.t('embed_istex_summary')}
                onClick={this.handleOpen}
            >
                <CodeIcon />
            </IconButton>)
        );
    };

    renderDialog = () => {
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
EmbedButton.defaultProps = {
    className: null,
};

export default EmbedButton;
