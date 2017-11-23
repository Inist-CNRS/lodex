import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import Subheader from 'material-ui/Subheader';
import { CardText } from 'material-ui/Card';

import { ShareButtons, generateShareIcon } from 'react-share';

import { polyglot as polyglotPropTypes } from '../propTypes';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    VKShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const VKIcon = generateShareIcon('vk');

const styles = {
    container: {
        display: 'flex',
    },
    icon: {
        cursor: 'pointer',
        margin: '0px 6px 0px 18px',
    },
};

export const ShareComponent = ({ uri, title, p: polyglot }) => (
    <div className="share">
        <Subheader>{polyglot.t('share')}</Subheader>

        <CardText style={styles.container}>
            <FacebookShareButton
                className="share-facebook"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <GooglePlusShareButton
                className="share-google"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <GooglePlusIcon size={32} round />
            </GooglePlusShareButton>
            <LinkedinShareButton
                className="share-linkedin"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <TwitterShareButton
                className="share-twitter"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <TelegramShareButton
                className="share-telegram"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <TelegramIcon size={32} round />
            </TelegramShareButton>
            <WhatsappShareButton
                className="share-whatsapp"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <VKShareButton
                className="share-vk"
                url={uri}
                title={title}
                style={styles.icon}
            >
                <VKIcon size={32} round />
            </VKShareButton>
        </CardText>
    </div>
);

ShareComponent.propTypes = {
    uri: PropTypes.string.isRequired,
    title: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

ShareComponent.defaultProps = {
    title: null,
};

export default translate(ShareComponent);
