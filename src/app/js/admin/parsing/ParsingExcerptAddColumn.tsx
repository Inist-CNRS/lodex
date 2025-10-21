import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Button } from '@mui/material';

import { fromFields } from '../../sharedSelectors';
import { useTranslate } from '../../i18n/I18NContext';

interface ParsingExcerptAddColumnComponentProps {
    atTop: boolean;
    handleAddColumn(...args: unknown[]): unknown;
    name: string;
    style?: object;
    isFieldsLoading?: boolean;
}

export const ParsingExcerptAddColumnComponent = ({
    handleAddColumn,

    name,

    atTop,

    isFieldsLoading,
}: ParsingExcerptAddColumnComponentProps) => {
    const { translate } = useTranslate();
    return (
        <Button
            variant="contained"
            className={`btn-excerpt-add-column btn-excerpt-add-column-${name.replace(
                ' ',
                '-',
            )}`}
            onClick={handleAddColumn}
            color="primary"
            disabled={isFieldsLoading}
            sx={{
                bottom: atTop ? '0' : '-50%',
                transform: atTop ? 'translateY(0)' : 'translateY(50%)',
                position: 'absolute',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80%',
                display: 'flex',
                zIndex: 1,
            }}
        >
            {translate('add_to_publication')}
        </Button>
    );
};

ParsingExcerptAddColumnComponent.defaultProps = {
    style: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isFieldsLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleAddColumn:
            // @ts-expect-error TS7031


                ({ name, onAddColumn }) =>
                () =>
                    onAddColumn(name),
    }),
    // @ts-expect-error TS2345
)(ParsingExcerptAddColumnComponent);
