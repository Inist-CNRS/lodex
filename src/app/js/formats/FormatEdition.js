import React, { Component } from 'react';
import merge from '../lib/merge';

import SelectFormat from './SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../formats';
import { formField as formFieldPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
        width: '100%',
    },
};

class FormatEdition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.input.value.name,
            args: merge(
                getFormatInitialArgs(props.input.value.name),
                props.input.value.args,
            ),
        };
    }

    setArguments = args => {
        this.setState({ args }, () => this.props.input.onChange(this.state));
    };

    setFormat = name => {
        this.setState({ name, args: getFormatInitialArgs(name) }, () =>
            this.props.input.onChange(this.state),
        );
    };

    render() {
        const { name, args } = this.state;

        const AdminComponent = getAdminComponent(name);

        return (
            <div style={styles.container}>
                <SelectFormat
                    formats={FORMATS}
                    value={name}
                    onChange={this.setFormat}
                />
                <AdminComponent
                    onChange={this.setArguments}
                    {...this.props}
                    args={args}
                />
            </div>
        );
    }
}

FormatEdition.propTypes = formFieldPropTypes;

export default FormatEdition;
