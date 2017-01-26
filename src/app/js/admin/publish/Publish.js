import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import { publish as publishAction } from './';
import Alert from '../../lib/Alert';
import ButtonWithStatus from '../../lib/ButtonWithStatus';

export class PublicationComponent extends Component {
    handleClick = () => {
        this.props.publish();
    }

    render() {
        const { error, loading, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('Publication')} />
                <CardText>
                    {polyglot.t('Publication explanations')}
                </CardText>
                <CardActions>
                    <ButtonWithStatus
                        loading={loading}
                        error={error}
                        success={published}
                        label={polyglot.t('Publish')}
                        onTouchTap={this.handleClick}
                    />
                    {error && <Alert><p>{error}</p></Alert>}
                </CardActions>
            </Card>
        );
    }
}

PublicationComponent.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    publish: PropTypes.func.isRequired,
    published: PropTypes.bool.isRequired,
};

PublicationComponent.defaultProps = {
    error: null,
};

const mapStateToProps = ({ publication: { error, loading, published } }) => ({
    error: error && (error.message || error),
    loading,
    published,
});

const mapDispatchToProps = ({
    publish: publishAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationComponent);
