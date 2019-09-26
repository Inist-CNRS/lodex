/* globals URL */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import translate from 'redux-polyglot/translate';
import { Button, TextField, ListSubheader } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { getCleanHost } from '../../../common/uris';

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
    const baseUrl = getCleanHost().replace(/https?:/, '');
    const strFields = JSON.stringify(fields);

    return `<iframe src="${baseUrl}/api/widget?type=${type}${
        uri ? `&uri=${uri}` : ''
    }&fields=${strFields}"></iframe>`;
}

export class WidgetExportItemComponent extends Component {
    constructor(props) {
        super(props);
        const { uri, fields, type } = this.props;

        this.state = {
            value: generateWidget(uri, fields, type),
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { uri, fields, type } = nextProps;
        this.setState({ value: generateWidget(uri, fields, type) });
    }

    saveRef = ref => {
        this.input = ref;
    };

    handleClick = () => {
        this.input.select();
    };

    render() {
        const { label, p: polyglot } = this.props;
        const { value } = this.state;

        return (
            <div className="share-widget">
                <ListSubheader>{polyglot.t(label)}</ListSubheader>
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
                        <Button>{polyglot.t('copy_to_clipboard')}</Button>
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
