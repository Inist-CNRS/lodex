import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

import {
    field as fieldPropTypes,
    resource as resourcePropTypes,
} from '../../propTypes';
import SearchResult from './SearchResult';
import SearchResultPlaceholders from './SearchResultPlaceholders';
import stylesToClassname from '../../lib/stylesToClassName';

const DEFAULT_PLACEHOLDER_NUMBER = 8;
const PLACEHOLDER_WIDTH = 75;

const styles = stylesToClassname(
    {
        container: {
            position: 'relative',
        },
        loadingContainer: {
            minHeight: DEFAULT_PLACEHOLDER_NUMBER * PLACEHOLDER_WIDTH,
        },
        placeholders: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            transition: 'opacity 300ms ease-in-out',
            pointerEvents: 'none',
        },
        displayedPlaceholders: {
            opacity: 1,
        },
    },
    'search-result-list',
);

class SearchResultList extends Component {
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholders: false,
        };
        // @ts-expect-error TS2339
        this.timeout = null;
    }

    // @ts-expect-error TS7006
    shouldComponentUpdate(nextProps, nextState) {
        return (
            // @ts-expect-error TS2339
            nextState.renderPlaceholders !== this.state.renderPlaceholders ||
            // @ts-expect-error TS2339
            nextProps.placeholders !== this.props.placeholders ||
            // @ts-expect-error TS2339
            !isEqual(nextProps.results, this.props.results)
        );
    }

    // TODO: Replace all this magic by React Suspense when it will be supported
    componentDidUpdate() {
        if (
            // @ts-expect-error TS2339
            this.props.placeholders &&
            // @ts-expect-error TS2339
            !this.state.renderPlaceholders &&
            // @ts-expect-error TS2339
            !this.timeout
        ) {
            // @ts-expect-error TS2339
            this.timeout = setTimeout(() => {
                this.setState({ renderPlaceholders: true });
                // @ts-expect-error TS2339
                this.timeout = null;
            }, 1000);
        }

        // @ts-expect-error TS2339
        if (!this.props.placeholders) {
            // @ts-expect-error TS2339
            if (this.timeout) {
                // @ts-expect-error TS2339
                clearTimeout(this.timeout);
                // @ts-expect-error TS2339
                this.timeout = null;
            }

            // @ts-expect-error TS2339
            if (this.state.renderPlaceholders) {
                this.setState({ renderPlaceholders: false });
            }
        }
    }

    render() {
        // @ts-expect-error TS2339
        const { results, fields, fieldNames, closeDrawer } = this.props;
        // @ts-expect-error TS2339
        const { renderPlaceholders } = this.state;

        return (
            <div
                // @ts-expect-error TS2339
                className={classnames(styles.container, {
                    // @ts-expect-error TS2339
                    [styles.loadingContainer]: renderPlaceholders,
                })}
            >
                {/*
                 // @ts-expect-error TS7006 */}
                {results.map((result) => (
                    <SearchResult
                        key={result.uri}
                        fields={fields}
                        fieldNames={fieldNames}
                        result={result}
                        closeDrawer={closeDrawer}
                    />
                ))}
                <SearchResultPlaceholders
                    // @ts-expect-error TS2339
                    className={classnames(styles.placeholders, {
                        // @ts-expect-error TS2339
                        [styles.displayedPlaceholders]: renderPlaceholders,
                    })}
                />
            </div>
        );
    }
}

// @ts-expect-error TS2339
SearchResultList.propTypes = {
    results: PropTypes.arrayOf(resourcePropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
    placeholders: PropTypes.bool,
};

// @ts-expect-error TS2339
SearchResultList.defaultProps = {
    placeholders: false,
};

export default SearchResultList;
