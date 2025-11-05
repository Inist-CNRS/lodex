import { Component } from 'react';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

import SearchResult from './SearchResult';
import SearchResultPlaceholders from './SearchResultPlaceholders';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import type { Field } from '@lodex/frontend-common/fields/types';

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

type SearchResultListProps = {
    results: { uri: string }[];
    fieldNames: {
        uri?: string;
        title?: string;
        description?: string;
    };
    fields: Field[];
    closeDrawer(): void;
    placeholders?: boolean;
};

class SearchResultList extends Component<SearchResultListProps> {
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
            nextProps.placeholders !== this.props.placeholders ||
            !isEqual(nextProps.results, this.props.results)
        );
    }

    // TODO: Replace all this magic by React Suspense when it will be supported
    componentDidUpdate() {
        if (
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
                {results.map((result) => (
                    <SearchResult
                        key={result.uri}
                        fields={fields}
                        fieldNames={fieldNames}
                        result={result}
                        closeDrawer={closeDrawer}
                    />
                ))}
                {/* 
                // @ts-expect-error TS2339 */}
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

export default SearchResultList;
