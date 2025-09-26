import BackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { Button, Card, CardActions, CardContent } from '@mui/material';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { withRouter } from 'react-router-dom';
import { Swipeable } from 'react-swipeable';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { useTranslate } from '../../i18n/I18NContext';

import { getResourceUri } from '../../../../common/uris';
import { preLoadPublication } from '../../fields';
import Link from '../../lib/components/Link';
import Loading from '../../lib/components/Loading';
import NavButton, { NEXT, PREV } from '../../lib/components/NavButton';
import stylesToClassname from '../../lib/stylesToClassName';
import { fromCharacteristic, fromFields } from '../../sharedSelectors';
import { preLoadExporters } from '../export';
import { fromResource, fromSearch } from '../selectors';
import { preLoadResource } from './';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { useRememberVisit } from './useRememberVisit';

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

// @ts-expect-error TS7006
const buildLocationFromResource = (resource) =>
    resource
        ? {
              pathname: getResourceUri(resource),
              state: {},
          }
        : {};

// @ts-expect-error TS7006
const navigate = (history, location) => history.push(location);

// @ts-expect-error TS7006
const getArkResourceUrl = (naan, rest) => {
    return `${naan}/${rest}`;
};

export const ResourceComponent = ({
    // @ts-expect-error TS7031
    history,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    datasetTitleKey,
    // @ts-expect-error TS7031
    characteristics,
    // @ts-expect-error TS7031
    loading,
    // @ts-expect-error TS7031
    removed,
    // @ts-expect-error TS7031
    prevResource,
    // @ts-expect-error TS7031
    nextResource,
    // @ts-expect-error TS7031
    match,
    // @ts-expect-error TS7031
    tenant,
    // @ts-expect-error TS7031
    preLoadResource,
    // @ts-expect-error TS7031
    preLoadPublication,
    // @ts-expect-error TS7031
    preLoadExporters,
}) => {
    useRememberVisit(resource);
    const { translate } = useTranslate();

    const [lastResourceUri, setLastResourceUri] = useState(null);

    const newLastResourceUri = useMemo(() => {
        return match.params
            ? match.params.naan && match.params.rest
                ? getArkResourceUrl(match.params.naan, match.params.rest)
                : match.params.uri
            : null;
    }, [match.params]);

    useEffect(() => {
        preLoadPublication();
        preLoadExporters();
    }, [preLoadExporters, preLoadPublication, preLoadResource]);

    useEffect(() => {
        preLoadResource();
    }, [match.params, preLoadResource]);

    useEffect(() => {
        // Is not a subresource
        if (
            match.params &&
            match.params.uri &&
            match.params.uri.length !== 32 &&
            !match.params.uri.includes('%2F') && // md5 length for subresources uuid
            match.params.uri !== lastResourceUri
        ) {
            setLastResourceUri(match.params.uri);
        } else if (match.params && match.params.naan && match.params.rest) {
            // Ark resources
            const newLastResourceUri = getArkResourceUrl(
                match.params.naan,
                match.params.rest,
            );
            if (newLastResourceUri !== lastResourceUri) {
                // @ts-expect-error TS2345
                setLastResourceUri(newLastResourceUri);
            }
        }
    }, [lastResourceUri, match.params]);

    if (loading) {
        return (
            // @ts-expect-error TS2322
            <Loading className="resource">
                {translate('loading_resource')}
            </Loading>
        );
    }

    const backToListLabel =
        (datasetTitleKey && characteristics[datasetTitleKey]) ||
        translate('back_to_list');

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
                        <h1>{translate('not_found')}</h1>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const goBackButton = lastResourceUri &&
        lastResourceUri !== newLastResourceUri && (
            <Button
                variant="text"
                onClick={history.goBack}
                startIcon={<BackIcon />}
            >
                {translate('back_to_resource')}
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
            // @ts-expect-error TS2769
            id="resource-page"
            className="resource"
            {...swipeableConfig}
            onSwipedRight={navigatePrev}
            onSwipedLeft={navigateNext}
        >
            {removed && <RemovedDetail />}
            {!removed && (
                <Detail backToListLabel={backToListLabel} tenant={tenant} />
            )}
            {prevResource && (
                // @ts-expect-error TS2339
                <div className={classnames(navStyles.nav, navStyles.left)}>
                    <NavButton direction={PREV} navigate={navigatePrev} />
                </div>
            )}
            {nextResource && (
                // @ts-expect-error TS2339
                <div className={classnames(navStyles.nav, navStyles.right)}>
                    <NavButton direction={NEXT} navigate={navigateNext} />
                </div>
            )}
            {goBackButton && (
                <Card sx={{ marginTop: '0.5rem' }}>
                    <CardActions>{goBackButton}</CardActions>
                </Card>
            )}
        </Swipeable>
    );
};

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
            naan: PropTypes.string,
            rest: PropTypes.string,
        }),
    }).isRequired,
    prevResource: PropTypes.object,
    nextResource: PropTypes.object,
    tenant: PropTypes.string,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    // @ts-expect-error TS2339
    const resource = fromResource.getResourceLastVersion(state);

    return {
        resource,
        // @ts-expect-error TS2339
        removed: fromResource.hasBeenRemoved(state),
        // @ts-expect-error TS2339
        characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
        // @ts-expect-error TS2339
        datasetTitleKey: fromFields.getDatasetTitleFieldName(state),
        // @ts-expect-error TS2339
        fields: fromFields.getFields(state),
        // @ts-expect-error TS2339
        loading: fromResource.isLoading(state),
        // @ts-expect-error TS2339
        prevResource: fromSearch.getPrevResource(state, resource),
        // @ts-expect-error TS2339
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
    withRouter,
)(ResourceComponent);
