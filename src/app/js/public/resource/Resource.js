import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import HomeIcon from '@mui/icons-material/Home';
import BackIcon from '@mui/icons-material/ArrowBack';
import { CardContent, CardActions, Card, Button } from '@mui/material';
import { Swipeable } from 'react-swipeable';

import { fromResource, fromSearch } from '../selectors';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/components/Loading';
import { preLoadResource } from './';
import { preLoadPublication } from '../../fields';
import { preLoadExporters } from '../export';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';
import NavButton, { NEXT, PREV } from '../../lib/components/NavButton';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { getResourceUri } from '../../../../common/uris';

const navStyles = stylesToClassname(
    {
        nav: {
            position: 'fixed',
            top: '50%',
        },
        left: {
            left: '0',
            '@media (min-width: 992px)': {
                marginLeft: '10px',
            },
        },
        right: {
            right: '0',
            '@media (min-width: 992px)': {
                marginRight: '10px',
            },
        },
    },
    'resource-navigation',
);

const buildLocationFromResource = (resource) =>
    resource
        ? {
              pathname: getResourceUri(resource),
              state: {},
          }
        : {};

const navigate = (history, location) => history.push(location);

export class ResourceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lastResourceUri: null };
    }

    UNSAFE_componentWillMount() {
        this.props.preLoadResource();
        this.props.preLoadPublication();
        this.props.preLoadExporters();
    }

    componentDidUpdate(prevProps) {
        const { match } = this.props;

        if (
            !isEqual(
                get(match, 'params', {}),
                get(prevProps, 'match.params', {}),
            )
        ) {
            this.props.preLoadResource();
        }

        // Is not a subresource
        if (
            match.params &&
            match.params.uri &&
            match.params.uri.length !== 32 &&
            !match.params.uri.includes('%2F') && // md5 length for subresources uuid
            match.params.uri !== this.state.lastResourceUri
        ) {
            this.setState({ lastResourceUri: match.params.uri });
        }
    }

    render() {
        const {
            history,
            resource,
            datasetTitleKey,
            characteristics,
            loading,
            removed,
            p: polyglot,
            prevResource,
            nextResource,
            match,
        } = this.props;

        if (loading) {
            return (
                <Loading className="resource">
                    {polyglot.t('loading_resource')}
                </Loading>
            );
        }

        const backToListLabel =
            (datasetTitleKey && characteristics[datasetTitleKey]) ||
            polyglot.t('back_to_list');

        const backToListButton = (
            <Button
                variant="text"
                className="btn-back-to-list"
                component={(props) => <Link to="/graph" {...props} />}
                startIcon={<HomeIcon />}
            >
                {backToListLabel}
            </Button>
        );

        if (!resource && !loading) {
            return (
                <div className="not-found">
                    <Card sx={{ marginTop: '0.5rem' }}>
                        <CardActions>{backToListButton}</CardActions>
                    </Card>
                    <Card sx={{ marginTop: '0.5rem' }}>
                        <CardContent>
                            <h1>{polyglot.t('not_found')}</h1>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        const goBackButton = this.state.lastResourceUri &&
            this.state.lastResourceUri !== match.params.uri && (
                <Button
                    variant="text"
                    onClick={history.goBack}
                    startIcon={<BackIcon />}
                >
                    {polyglot.t('back_to_resource')}
                </Button>
            );

        const swipeableConfig = {
            preventDefaultTouchmoveEvent: true,
            trackMouse: false,
        };

        const prevLocation = buildLocationFromResource(prevResource);
        const nextLocation = buildLocationFromResource(nextResource);

        const navigatePrev = () => navigate(history, prevLocation);
        const navigateNext = () => navigate(history, nextLocation);

        return (
            <Swipeable
                {...swipeableConfig}
                onSwipedRight={navigatePrev}
                onSwipedLeft={navigateNext}
            >
                <div className="resource">
                    {removed && <RemovedDetail />}
                    {!removed && <Detail backToListLabel={backToListLabel} />}
                    {prevResource && (
                        <div
                            className={classnames(
                                navStyles.nav,
                                navStyles.left,
                            )}
                        >
                            <NavButton
                                direction={PREV}
                                navigate={navigatePrev}
                            />
                        </div>
                    )}
                    {nextResource && (
                        <div
                            className={classnames(
                                navStyles.nav,
                                navStyles.right,
                            )}
                        >
                            <NavButton
                                direction={NEXT}
                                navigate={navigateNext}
                            />
                        </div>
                    )}
                    {goBackButton && (
                        <Card sx={{ marginTop: '0.5rem' }}>
                            <CardActions>{goBackButton}</CardActions>
                        </Card>
                    )}
                </div>
            </Swipeable>
        );
    }
}

ResourceComponent.defaultProps = {
    characteristics: null,
    resource: null,
    datasetTitle: null,
    datasetTitleKey: null,
    titleKey: null,
    prevResource: null,
    nextResource: null,
    removed: false,
};

ResourceComponent.propTypes = {
    characteristics: PropTypes.shape({}),
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
        subresourceId: PropTypes.string,
    }),
    p: polyglotPropTypes.isRequired,
    datasetTitleKey: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    removed: PropTypes.bool.isRequired,
    preLoadResource: PropTypes.func.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    preLoadExporters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            uri: PropTypes.string,
        }),
    }).isRequired,
    prevResource: PropTypes.object,
    nextResource: PropTypes.object,
};

const mapStateToProps = (state) => {
    const resource = fromResource.getResourceLastVersion(state);

    return {
        resource,
        removed: fromResource.hasBeenRemoved(state),
        characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
        datasetTitleKey: fromFields.getDatasetTitleFieldName(state),
        fields: fromFields.getFields(state),
        loading: fromResource.isLoading(state),
        prevResource: fromSearch.getPrevResource(state, resource),
        nextResource: fromSearch.getNextResource(state, resource),
    };
};

const mapDispatchToProps = {
    preLoadResource,
    preLoadPublication,
    preLoadExporters,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    withRouter,
)(ResourceComponent);
