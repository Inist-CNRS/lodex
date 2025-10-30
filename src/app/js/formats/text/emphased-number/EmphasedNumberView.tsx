// @ts-expect-error TS7016
import commaNumber from 'comma-number';
import { Component } from 'react';
import compose from 'recompose/compose';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

import { type Field } from '../../../propTypes';
import injectData from '../../injectData';
import Bigbold from './Bigbold';

// @ts-expect-error TS7006
function getNumber(numb) {
    if (Number.isInteger(numb)) {
        // /api/run/count-all
        // /api/run/total-of
        return numb;
    }
    if (Number.isFinite(numb) && numb % 1 != 0) {
        return numb.toFixed(2);
    }
    if (Array.isArray(numb) && numb.length === 1) {
        // /api/run/count-by-fields
        const { value } = numb.shift();
        return Number(value);
    }
    if (Array.isArray(numb)) {
        // just an array
        return Number(numb.length);
    }
    if (Number.isInteger(numb.total)) {
        // all others routines
        return Number(numb.total);
    }
    return 0;
}

interface EmphasedNumberViewProps {
    field: Field;
    resource?: object;
    formatData?: number;
    className?: string;
    size: number;
    colors: string;
}

class EmphasedNumberView extends Component<EmphasedNumberViewProps> {
    render() {
        const { field, className, resource, formatData, size, colors } =
            this.props;

        // @ts-expect-error TS18048
        const value = getNumber(formatData || resource[field.name]);
        return (
            <div
                className={`${className} property_value_item property_value_ribbon`}
                style={{
                    display: 'inline-block',
                    position: 'relative',
                }}
            >
                <Bigbold
                    value={commaNumber(value, ' ')}
                    colors={colors}
                    size={size}
                />
            </div>
        );
    }
}

export default compose(
    translate,
    // @ts-expect-error TS2345
    injectData(({ field, resource }) => {
        // Try to use the field value as a number, otherwise it's probably a routine
        const value = resource[field.name];
        return isNaN(value) ? value : null;
    }),
    // @ts-expect-error TS2345
)(EmphasedNumberView);
