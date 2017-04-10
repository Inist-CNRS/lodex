import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';


const IstexViewComponent = ({ title, publicationDate, abstract, handleOpenUrl }) => (
    <ListItem
        onClick={handleOpenUrl}
        leftIcon={<PdfIcon />}
        primaryText={`${title} ${publicationDate}`}
        secondaryText={abstract}
    />
);

IstexViewComponent.propTypes = {
    title: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    handleOpenUrl: PropTypes.func.isRequired,
    abstract: PropTypes.string,
};

IstexViewComponent.defaultProps = {
    abstract: null,
};

export default compose(
    withHandlers({
        handleOpenUrl: ({ fulltext }) => () => window.open(fulltext),
    }),
)(IstexViewComponent);
