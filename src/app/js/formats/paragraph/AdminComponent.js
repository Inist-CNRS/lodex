import React, { Component, PropTypes } from 'react';
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

class ParagraphEdition extends Component {
    static propTypes = {
        paragraphWidth: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        paragraphWidth: '100%',
    }
    constructor(props) {
        super(props);

        this.state = {
            paragraphWidth: this.props.paragraphWidth,
        };
    }

    setWidth = (paragraphWidth) => {
        this.setState({ paragraphWidth });
        this.props.onChange({ paragraphWidth });
    }

    render() {
        const { paragraphWidth } = this.state;
        const { p: polyglot } = this.props;
        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_image_width')}
                    onChange={(event, index, newValue) => this.setWidth(newValue)}
                    style={styles.input}
                    value={paragraphWidth}
                >
                    <MenuItem value="10%" primaryText={polyglot.t('ten_percent')} />
                    <MenuItem value="20%" primaryText={polyglot.t('twenty_percent')} />
                    <MenuItem value="30%" primaryText={polyglot.t('thirty_percent')} />
                    <MenuItem value="50%" primaryText={polyglot.t('fifty_percent')} />
                    <MenuItem value="80%" primaryText={polyglot.t('eighty_percent')} />
                    <MenuItem value="100%" primaryText={polyglot.t('hundred_percent')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(ParagraphEdition);
