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

    return `<iframe src="${baseUrl}/api/widget?type=${encType}&uri=${encUri}&fields=${encFields}"></iframe>`;
}

export class ShareLinkComponent extends Component {
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
        const { type, p: polyglot } = this.props;
        const { value } = this.state;

        return (
            <div className="share-widget">
                <Subheader>{polyglot.t(type)}</Subheader>
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

ShareLinkComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
};

export default translate(ShareLinkComponent);
