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

class TitleAdmin extends Component {
    static propTypes = {
        args: {
            level: PropTypes.number,
        },
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            level: 1,
        },
    };

    setLevel = level => {
        this.props.onChange({ level });
    };

    render() {
        const { p: polyglot, args: { level } } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_level')}
                    onChange={(event, index, newValue) =>
                        this.setLevel(newValue)
                    }
                    style={styles.input}
                    value={level}
                >
                    <MenuItem value={1} primaryText={polyglot.t('level1')} />
                    <MenuItem value={2} primaryText={polyglot.t('level2')} />
                    <MenuItem value={3} primaryText={polyglot.t('level3')} />
                    <MenuItem value={4} primaryText={polyglot.t('level4')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(TitleAdmin);
