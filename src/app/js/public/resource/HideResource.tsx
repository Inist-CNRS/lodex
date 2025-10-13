import { useState } from 'react';
import { HideResourceForm } from './HideResourceForm';
import { Button } from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import { useSelector } from 'react-redux';
import { fromUser } from '../../sharedSelectors';

export const HideResource = () => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const isAdmin = useSelector(fromUser.isAdmin);

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <Button
                variant="text"
                className="dialog-button hide-resource"
                color="primary"
                onClick={() => setIsOpen(true)}
            >
                {translate('hide')}
            </Button>

            <HideResourceForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};
