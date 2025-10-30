import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import get from 'lodash/get';

import { getPercentValue } from '@lodex/frontend-common/utils/getPercentage';
import { getShortText } from '@lodex/frontend-common/utils/longTexts';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import injectData from '../../injectData';
import AsterPlot from './AsterPlot';
import { getResourceUri } from '@lodex/common';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

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

interface AsterPlotChartViewProps {
    data: unknown[];
    colorSet?: string[];
}

const AsterPlotChartView = ({ data, colorSet }: AsterPlotChartViewProps) => {
    return (
        // @ts-expect-error TS2339
        <div className={styles.container}>
            <AsterPlot
                // @ts-expect-error TS2322
                data={data}
                width={200}
                height={200}
                colorSet={colorSet}
            />
        </div>
    );
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
    // @ts-expect-error TS2345
)(AsterPlotChartView);
