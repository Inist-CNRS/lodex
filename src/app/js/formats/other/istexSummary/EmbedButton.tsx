import { useState } from 'react';
import { IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import classnames from 'classnames';

import ButtonWithDialog from '../../../lib/components/ButtonWithDialog';
import { getCleanHost } from '@lodex/common';
import { useTranslate } from '../../../i18n/I18NContext';

interface EmbedButtonProps {
    className?: string;
    uri: string;
    fieldName: string;
}

const EmbedButton = ({ className, uri, fieldName }: EmbedButtonProps) => {
    const { translate } = useTranslate();
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const renderOpenButton = () => {
        return (
            // @ts-expect-error TS2769
            <IconButton
                className={classnames('embed-button', className)}
                style={{ position: 'absolute' }}
                tooltip={translate('embed_istex_summary')}
                onClick={handleOpen}
            >
                <CodeIcon />
            </IconButton>
        );
    };

    const renderDialog = () => {
        const host = getCleanHost();

        return (
            <>
                <p>{translate('embed_step_head')}</p>
                <pre>
                    {`<script src="${host}/embeddedIstexSummary.js" defer></script>`}
                </pre>
                <p>{translate('embed_step_div')}</p>
                <pre>
                    {`<div class="embedded-istex-summary" data-api="${host}" data-uri="${uri}" data-field-name="${fieldName}"></div>`}
                </pre>
            </>
        );
    };

    return (
        <ButtonWithDialog
            label={translate('embed_istex_summary')}
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            openButton={renderOpenButton()}
            dialog={renderDialog()}
        />
    );
};

export default EmbedButton;
