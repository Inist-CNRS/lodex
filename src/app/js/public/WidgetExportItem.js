/* globals URL */
import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';

import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flexGrow: 2,
        margin: '0px 0px 0px 18px',
    },
};

export function generateWidget(uri, fields, type) {
    const baseUrl = process.env.PUBLIC_URL;
    const encFields = encodeURIComponent(JSON.stringify(fields));
    const encUri = encodeURIComponent(uri);
    const encType = encodeURIComponent(type);

    return `<iframe src="${baseUrl}/api/widget?type=${encType}${uri ? `&uri=${encUri}` : ''}&fields=${encFields}"></iframe>`;
}

export class WidgetExportItemComponent extends Component {
    constructor(props) {
        super(props);
        const { uri, fields, type } = this.props;

        this.state = {
            value: generateWidget(uri, fields, type),
        };
    }

    componentWillReceiveProps(nextProps) {
        const { uri, fields, type } = nextProps;
        this.setState({ value: generateWidget(uri, fields, type) });
    }

    saveRef = (ref) => {
        this.input = ref;
    }

    handleClick = () => {
        this.input.select();
    }

    render() {
        const { label, p: polyglot } = this.props;
        const { value } = this.state;

        return (
            <div className="share-widget">
                <Subheader>{polyglot.t(label)}</Subheader>
                <div style={styles.container}>
                    <TextField
                        ref={this.saveRef}
                        id="share-widget"
                        style={styles.input}
                        value={value}
                        fullWidth
                        onClick={this.handleClick}
                    />

                    <CopyToClipboard text={value}>
                        <FlatButton label={polyglot.t('copy_to_clipboard')} />
                    </CopyToClipboard>
                </div>
            </div>
        );
    }
}

WidgetExportItemComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    uri: PropTypes.string,
};

WidgetExportItemComponent.defaultProps = {
    uri: null,
};


export default translate(WidgetExportItemComponent);
