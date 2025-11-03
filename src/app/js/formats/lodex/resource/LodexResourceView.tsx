import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import URL from 'url';

import { isURL } from '@lodex/common';
import LodexResource from '../../utils/components/LodexResource';
import injectData from '../../injectData';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = stylesToClassname(
    {
        wrapper: {
            padding: '1.1em',
            borderRadius: '3px',
            background: 'white',
            boxShadow: '0px 6px 6px rgba(170, 170, 170, 0.25)',
        },
    },
    'lodex-resource',
);

interface LodexResourceViewProps {
    field: Field;
    resource: object;
}

const LodexResourceView = (props: LodexResourceViewProps) => (
    // @ts-expect-error TS2339
    <div className={styles.wrapper}>
        {/*
         // @ts-expect-error TS2559 */}
        <LodexResource {...props} />
    </div>
);

// @ts-expect-error TS7006
const mapStateToProps = (state, { formatData = {} }) => {
    const {
        // @ts-expect-error TS18048
        id = '',
        // @ts-expect-error TS18048
        url = '',
        // @ts-expect-error TS18048
        title = 'n/a',
        // @ts-expect-error TS18048
        summary = '',
    } = get(formatData, 'items[0]', {});
    return {
        id,
        url,
        title,
        summary,
    };
};

export default compose(
    translate,
    // @ts-expect-error TS2345
    injectData(({ field, resource }) => {
        const value = resource[field.name];

        if (!value) {
            return null;
        }

        if (isURL(value)) {
            const source = URL.parse(value);
            // @ts-expect-error TS18047
            if (source.pathname.search(/^\/\w+:/) === 0) {
                // @ts-expect-error TS18047
                const uri = source.pathname.slice(1);
                const target = {
                    protocol: source.protocol,
                    hostname: source.hostname,
                    slashes: source.slashes,
                    pathname: '/api/run/syndication/',
                    search: `?$query[uri]=${encodeURIComponent(uri)}`,
                };
                return URL.format(target);
            }
            return value;
        }
        return `/api/run/syndication/?$query[uri]=${encodeURIComponent(
            resource[field.name],
        )}`;
    }),
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(LodexResourceView);
