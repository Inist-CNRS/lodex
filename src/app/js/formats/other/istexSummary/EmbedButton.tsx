import { Component } from 'react';
import { IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import classnames from 'classnames';

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
            <IconButton
                className={classnames('embed-button', className)}
                style={{ position: 'absolute' }}
                // @ts-expect-error TS18046
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
            <>
                {/*
                 // @ts-expect-error TS18046 */}
                <p>{polyglot.t('embed_step_head')}</p>
                <pre>
                    {`<script src="${host}/embeddedIstexSummary.js" defer></script>`}
                </pre>
                {/*
                 // @ts-expect-error TS18046 */}
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
                // @ts-expect-error TS18046
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

export default EmbedButton;
