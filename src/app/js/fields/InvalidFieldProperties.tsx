import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Alert from '../lib/components/Alert';
import { fromFields } from '../sharedSelectors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface InvalidFieldPropertiesProps {
    invalidProperties?: {
        name?: string;
        error?: string;
    }[];
}

const InvalidFieldProperties = ({
    invalidProperties,
}: InvalidFieldPropertiesProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS18048
    if (!invalidProperties.length) {
        return null;
    }

    return (
        <Alert>
            <ul>
                {/*
                 // @ts-expect-error TS7031 */}
                {invalidProperties.map(({ name, error }, index) => (
                    <li key={`${name}-${index}`}>
                        {translate(`error_${name}_${error}`)}
                    </li>
                ))}
            </ul>
        </Alert>
    );
};

// @ts-expect-error TS7006
const mapStateToprops = (state) => ({
    invalidProperties: fromFields.getInvalidProperties(state),
});

export default compose(
    connect(mapStateToprops),
    // @ts-expect-error TS2345
)(InvalidFieldProperties);
