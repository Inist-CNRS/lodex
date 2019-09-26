import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
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
        const {
            p: polyglot,
            args: { languageToHighlight },
        } = this.props;

        return (
            <div style={styles.container}>
                <Select
                    floatingLabelText={polyglot.t('list_of_language')}
                    onChange={(event, index, newValue) =>
                        this.setLanguageToHighlight(newValue)
                    }
                    style={styles.input}
                    value={languageToHighlight}
                >
                    <MenuItem value="xml">XML</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="ini">INI</MenuItem>
                    <MenuItem value="shell">Shell</MenuItem>
                    <MenuItem value="sql">SQL</MenuItem>
                    <MenuItem value="javascript">Javascript</MenuItem>
                </Select>
            </div>
        );
    }
}

export default translate(AdminComponent);
