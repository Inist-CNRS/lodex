import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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

export const defaultArgs = {
    languageToHighlight: '',
};

class AdminComponent extends Component {
    static propTypes = {
        args: PropTypes.shape({
            languageToHighlight: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };
    static defaultProps = {
        args: defaultArgs,
    };

    setLanguageToHighlight = languageToHighlight => {
        this.props.onChange({ languageToHighlight });
    };

    render() {
        const { p: polyglot, args: { languageToHighlight } } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_of_language')}
                    onChange={(event, index, newValue) =>
                        this.setLanguageToHighlight(newValue)
                    }
                    style={styles.input}
                    value={languageToHighlight}
                >
                    <MenuItem value="xml" primaryText="XML" />
                    <MenuItem value="json" primaryText="JSON" />
                    <MenuItem value="ini" primaryText="INI" />
                    <MenuItem value="shell" primaryText="Shell" />
                    <MenuItem value="sql" primaryText="SQL" />
                    <MenuItem value="javascript" primaryText="Javascript" />
                </SelectField>
            </div>
        );
    }
}

export default translate(AdminComponent);
