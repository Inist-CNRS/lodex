import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { MenuItem } from '@mui/material';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

interface ExportMenuItemProps {
    handleClick(): void;
    label: string;
}

const ExportMenuItem = ({ label, handleClick }: ExportMenuItemProps) => {
    const { translate } = useTranslate();

    return <MenuItem onClick={handleClick}>{translate(label)}</MenuItem>;
};

export default compose(
    withHandlers({
        handleClick:
            // @ts-expect-error TS7031


                ({ onClick, uri, exportID }) =>
                () =>
                    onClick({ uri, exportID }),
    }),
    // @ts-expect-error TS2345
)(ExportMenuItem);
