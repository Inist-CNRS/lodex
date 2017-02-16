import React, { Component } from 'react';
import { propTypes as reduxFormPropTypes } from 'redux-form';

import SelectFormat from './SelectFormat';
import FORMATS from './formats';

import uri from './uri';

const Empty = () => <span />;

const styles = {
    container: {
        display: 'inline-flex',
    },
};

class FormatEdition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.input.value.name,
            args: props.input.value.args,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value.name !== this.state.name) {
            this.setState({ name: nextProps.input.value.name });
        }

        if (nextProps.input.value.args !== this.state.args) {
            this.setState({ args: nextProps.input.value.args });
        }
    }

    setArguments = (args) => {
        this.setState({ args });
        this.props.input.onChange({
            args,
            name: this.state.name,
        });
    }

    setFormat = (name) => {
        this.setState({ name });
        this.props.input.onChange({
            args: this.state.args,
            name,
        });
    }

    render() {
        const { name } = this.state;

        let EditionComponent = null;

        switch (name) {
        case 'uri':
            EditionComponent = uri.EditionComponent;
            break;

        default:
            EditionComponent = Empty;
            break;
        }

        return (
            <div style={styles.container}>
                <SelectFormat
                    formats={FORMATS}
                    value={name}
                    onChange={this.setFormat}
                />
                <EditionComponent onChange={this.setArguments} {...{ ...this.props }} />
            </div>
        );
    }
}

FormatEdition.propTypes = reduxFormPropTypes;

export default FormatEdition;
