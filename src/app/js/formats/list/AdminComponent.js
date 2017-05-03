import React, { Component, PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

class ListEdition extends Component {
    static propTypes = {
        type: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        type: 'unordered',
    }
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
        };
    }

    setType = (type) => {
        this.setState({ type });
        this.props.onChange({ type });
    }

    render() {
        const { type } = this.state;
        const { p: polyglot } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_type')}
                    onChange={(event, index, newValue) => this.setType(newValue)}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="unordered" primaryText={polyglot.t('list_format_unordered')} />
                    <MenuItem value="ordered" primaryText={polyglot.t('list_format_ordered')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(ListEdition);
