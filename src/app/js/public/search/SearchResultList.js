import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import classnames from 'classnames';

import {
    field as fieldProptypes,
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
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholders: false,
        };
        this.timeout = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.renderPlaceholders !== this.state.renderPlaceholders ||
            nextProps.placeholders !== this.props.placeholders ||
            !isEqual(nextProps.results, this.props.results)
        );
    }

    // TODO: Replace all this magic by React Suspense when it will be supported
    componentDidUpdate() {
        if (
            this.props.placeholders &&
            !this.state.renderPlaceholders &&
            !this.timeout
        ) {
            this.timeout = setTimeout(() => {
                this.setState({ renderPlaceholders: true });
                this.timeout = null;
            }, 1000);
        }

        if (!this.props.placeholders) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            if (this.state.renderPlaceholders) {
                this.setState({ renderPlaceholders: false });
            }
        }
    }

    render() {
        const { results, fields, fieldNames, closeDrawer } = this.props;
        const { renderPlaceholders } = this.state;

        return (
            <div
                className={classnames(styles.container, {
                    [styles.loadingContainer]: renderPlaceholders,
                })}
            >
                {results.map(result => (
                    <SearchResult
                        key={result.uri}
                        fields={fields}
                        fieldNames={fieldNames}
                        result={result}
                        closeDrawer={closeDrawer}
                    />
                ))}
                <SearchResultPlaceholders
                    className={classnames(styles.placeholders, {
                        [styles.displayedPlaceholders]: renderPlaceholders,
                    })}
                />
            </div>
        );
    }
}

SearchResultList.propTypes = {
    results: PropTypes.arrayOf(resourcePropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
    placeholders: PropTypes.bool,
};

SearchResultList.defaultProps = {
    placeholders: false,
};

export default SearchResultList;
