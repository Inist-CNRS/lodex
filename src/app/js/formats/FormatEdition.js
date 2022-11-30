import React, { Component } from 'react';
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

// class FormatEdition extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             name: props.input.value.name || '',
//             args: merge(
//                 getFormatInitialArgs(props.input.value.name),
//                 props.input.value.args,
//             ),
//         };
//     }

//     setArguments = args => {
//         this.setState({ args }, () => this.props.input.onChange(this.state));
//     };

//     setFormat = name => {
//         this.setState({ name, args: getFormatInitialArgs(name) }, () =>
//             this.props.input.onChange(this.state),
//         );
//     };

//     render() {
//         const { name, args } = this.state;
//         const AdminComponent = getAdminComponent(name);

//         return (
//             <div style={styles.container}>
//                 <SelectFormat
//                     formats={FORMATS}
//                     value={name}
//                     onChange={this.setFormat}
//                 />
//                 <AdminComponent
//                     onChange={this.setArguments}
//                     {...this.props}
//                     args={args}
//                 />
//             </div>
//         );
//     }
// }

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
