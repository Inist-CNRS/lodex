import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Alert from '../lib/components/Alert';
import { fromFields } from '../sharedSelectors';
import { translate } from '../i18n/I18NContext';

interface InvalidFieldPropertiesProps {
    invalidProperties?: {
        name?: string;
        error?: string;
    }[];
    p?: unknown;
}

const InvalidFieldProperties = ({
    invalidProperties,
    p: polyglot,
}: InvalidFieldPropertiesProps) => {
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
                        {/*
                         // @ts-expect-error TS18046 */}
                        {polyglot.t(`error_${name}_${error}`)}
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
    translate,
    connect(mapStateToprops),
    // @ts-expect-error TS2345
)(InvalidFieldProperties);
