/* globals URL */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import translate from 'redux-polyglot/translate';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link as LinkIcon } from '@material-ui/icons';
import Subheader from '@material-ui/core/Subheader';
import { CardText } from '@material-ui/core/Card';

import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'flex',
    },
    input: {
        flexGrow: 2,
    },
    icon: {
        margin: '12px 12px 12px 18px',
    },
};

export class ShareLinkComponent extends Component {
    saveRef = ref => {
        this.input = ref;
    };

    handleClick = () => {
        this.input.select();
    };

    render() {
        const { uri, title, p: polyglot } = this.props;

        return (
            <div className="share-link">
                <Subheader>{title}</Subheader>

                <CardText style={styles.container}>
                    <LinkIcon style={styles.icon} />

                    <TextField
                        ref={this.saveRef}
                        id="share-link"
                        style={styles.input}
                        value={uri}
                        fullWidth
                        onClick={this.handleClick}
                    />

                    <CopyToClipboard text={uri}>
                        <Button label={polyglot.t('copy_to_clipboard')} />
                    </CopyToClipboard>
                </CardText>
            </div>
        );
    }
}

ShareLinkComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    title: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
};

export default translate(ShareLinkComponent);
