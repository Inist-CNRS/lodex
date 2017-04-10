import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

export const IstexItemComponent = ({ title, publicationDate, abstract, handleOpenUrl }) => (
    <ListItem
        onClick={handleOpenUrl}
        leftIcon={<PdfIcon />}
        primaryText={`${title} ${publicationDate}`}
        secondaryText={abstract}
    />
);

IstexItemComponent.propTypes = {
    title: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    handleOpenUrl: PropTypes.func.isRequired,
    abstract: PropTypes.string,
};

IstexItemComponent.defaultProps = {
    abstract: null,
};

export default compose(
    withHandlers({
        handleOpenUrl: ({ fulltext }) => () => window.open(fulltext),
    }),
)(IstexItemComponent);
