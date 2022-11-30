import React from 'react';
import merge from '../lib/merge';

import SelectFormat from './SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../formats';
import { formField as formFieldPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
};

const FormatEdition = props => {
    const { input } = props;
    const [name, setName] = React.useState(input.value.name || '');
    const [args, setArgs] = React.useState(
        merge(getFormatInitialArgs(input.value.name), input.value.args),
    );

    const setArguments = args => {
        setArgs(args);
        input.onChange({ name, args });
    };

    const setFormat = name => {
        setName(name);
        setArgs(getFormatInitialArgs(name));
        input.onChange({ name, args: getFormatInitialArgs(name) });
    };

    const AdminComponent = getAdminComponent(name);

    return (
        <div style={styles.container}>
            <SelectFormat formats={FORMATS} value={name} onChange={setFormat} />
            <AdminComponent onChange={setArguments} {...props} args={args} />
        </div>
    );
};

FormatEdition.propTypes = formFieldPropTypes;

export default FormatEdition;
