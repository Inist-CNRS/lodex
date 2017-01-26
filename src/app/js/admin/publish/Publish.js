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

export class PublishComponent extends Component {
    handleClick = () => {
        this.props.onPublish();
    }

    render() {
        const { error, loading, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('publication')} />
                <CardText>
                    {polyglot.t('publication_explanations')}
                </CardText>
                <CardActions>
                    <ButtonWithStatus
                        loading={loading}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
                    />
                    {error && <Alert><p>{error}</p></Alert>}
                </CardActions>
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
};

PublishComponent.defaultProps = {
    error: null,
};

const mapStateToProps = ({ publication: { error, loading, published } }) => ({
    error: error && (error.message || error),
    loading,
    published,
});

const mapDispatchToProps = ({
    onPublish: publishAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
