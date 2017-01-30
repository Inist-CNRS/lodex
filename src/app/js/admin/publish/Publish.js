import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import { publish as publishAction } from './';
import Alert from '../../lib/Alert';
import Card from '../../lib/Card';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import ParsingExcerpt from '../parsing/ParsingExcerpt';
import { loadField } from '../fields';

export class PublishComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleClick = () => {
        this.props.onPublish();
    }

    render() {
        const { error, loading, p: polyglot, published, transformedLines, fields } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('publication')} />
                <ParsingExcerpt columns={fields} lines={transformedLines} />
                <CardActions>
                    <ButtonWithStatus
                        className="btn-publish"
                        loading={loading}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
                    />
                    {error && <Alert><p>{error}</p></Alert>}
                </CardActions>
                <CardText>
                    {polyglot.t('publication_explanations')}
                </CardText>
            </Card>
        );
    }
}

PublishComponent.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onPublish: PropTypes.func.isRequired,
    published: PropTypes.bool.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    transformedLines: PropTypes.arrayOf(PropTypes.string).isRequired,
    loadField: PropTypes.func.isRequired,
};

PublishComponent.defaultProps = {
    error: null,
};

const mapStateToProps = ({ publication: { error, loading, published }, parsing: { excerptLines }, fields }) => ({
    fields,
    transformedLines: excerptLines,
    error: error && (error.message || error),
    loading,
    published,
});

const mapDispatchToProps = ({
    onPublish: publishAction,
    loadField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
