import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';

const styles = {
    link: { textDecoration: 'none' },
};

export const IstexItemComponent = ({
    title,
    publicationDate,
    abstract,
    fulltext,
}) => (
    <a
        href={fulltext}
        rel="noopener noreferrer"
        target="_blank"
        style={styles.link}
    >
        <ListItem
            leftIcon={<PdfIcon />}
            primaryText={`${title} ${publicationDate}`}
            secondaryText={abstract}
        />
    </a>
);

IstexItemComponent.propTypes = {
    title: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    fulltext: PropTypes.string.isRequired,
    abstract: PropTypes.string,
};

IstexItemComponent.defaultProps = {
    abstract: null,
};

export default IstexItemComponent;
