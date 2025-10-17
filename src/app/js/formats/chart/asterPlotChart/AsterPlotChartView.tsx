import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import get from 'lodash/get';

import { getPercentValue } from '../../../lib/getPercentage';
import { getShortText } from '../../../lib/longTexts';
import stylesToClassname from '../../../lib/stylesToClassName';
import injectData from '../../injectData';
import AsterPlot from './AsterPlot';
import { getResourceUri } from '../../../../../common/uris';
import { translate } from '../../../i18n/I18NContext';

const sortByKey =
    (key = '') =>
    // @ts-expect-error TS7006
    (dataA, dataB) => {
        if (key === '') {
            return 0;
        }

        const a = get(dataA, `${key}`, '');
        const b = get(dataB, `${key}`, '');

        return Math.sign(a - b);
    };

// @ts-expect-error TS7006
const prepareData = (data = [], history, polyglot) =>
    data
        .map((d) => {
            const title = getShortText(d['target_title']);
            const weight = get(d, 'weight', 0);
            const value = getPercentValue(weight);
            const label = `<div>${title}<br/><br/>${value}% ${polyglot.t(
                'similar',
            )}</div>`;
            const onClick = () => {
                history.push({
                    // @ts-expect-error TS2339
                    pathname: getResourceUri({ uri: d.target }),
                    state: {},
                });
            };

            return {
                label,
                value,
                onClick,
            };
        })
        .sort(sortByKey('index'));

const styles = stylesToClassname(
    {
        container: {
            margin: '10px',
        },
    },
    'aster-plot-chart-view',
);

// @ts-expect-error TS7031
const AsterPlotChartView = ({ data, colorSet }) => {
    return (
        // @ts-expect-error TS2339
        <div className={styles.container}>
            <AsterPlot
                data={data}
                width={200}
                height={200}
                colorSet={colorSet}
            />
        </div>
    );
};

AsterPlotChartView.propTypes = {
    data: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

// @ts-expect-error TS7006
const mapStateToProps = (_, { formatData, history, p: polyglot }) => ({
    data: prepareData(formatData, history, polyglot),
});

export default compose(
    translate,
    withRouter,
    injectData(null, null, true),
    connect(mapStateToProps),
)(AsterPlotChartView);
