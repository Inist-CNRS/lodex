import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Swipeable } from 'react-swipeable';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

import { fromResource, fromSearch } from '../selectors';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Card from '../../lib/components/Card';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/components/Loading';
import { preLoadResource } from './';
import { preLoadPublication } from '../../fields';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';
import NavButton, { NEXT, PREV } from '../../lib/components/NavButton';

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

const buildLocationFromResource = resource =>
    resource
        ? {
              pathname: `/${resource.uri}`,
              state: {},
          }
        : {};

const navigate = (history, location) => history.push(location);

export class ResourceComponent extends Component {
    UNSAFE_componentWillMount() {
        this.props.preLoadResource();
        this.props.preLoadPublication();
    }

    componentDidUpdate(prevProps) {
        if (
            !isEqual(
                get(this.props, 'match.params', {}),
                get(prevProps, 'match.params', {}),
            )
        ) {
            this.props.preLoadResource();
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
            <FlatButton
                className="btn-back-to-list"
                containerElement={<Link to="/graph" />}
                label={backToListLabel}
                icon={<HomeIcon />}
            />
        );

        if (!resource) {
            return (
                <div className="not-found">
                    <Card>
                        <CardActions>{backToListButton}</CardActions>
                    </Card>
                    <Card>
                        <CardText>
                            <h1>{polyglot.t('not_found')}</h1>
                        </CardText>
                    </Card>
                </div>
            );
        }
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
};

ResourceComponent.propTypes = {
    characteristics: PropTypes.shape({}),
    resource: PropTypes.shape({ uri: PropTypes.string.isRequired }),
    p: polyglotPropTypes.isRequired,
    datasetTitleKey: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    removed: PropTypes.bool.isRequired,
    preLoadResource: PropTypes.func.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            uri: PropTypes.string,
        }),
    }).isRequired,
    prevResource: PropTypes.object,
    nextResource: PropTypes.object,
};

const mapStateToProps = state => {
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
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
    withRouter,
)(ResourceComponent);
