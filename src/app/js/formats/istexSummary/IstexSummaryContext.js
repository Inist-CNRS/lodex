import React, { createContext, Component } from 'react';
import get from 'lodash.get';
import set from '../../../../common/lib/set';

import { getDecadeYearData, getVolumeData, getIssueData, getDocumentData } from './getIstexData';

export const IstexSummaryContext = createContext({
    formatData: [],
});

const getInitialState = props => ({
    decade: props.decade,
    year: props.year,
    volumes: {},
    issues: {},
});

export class IstexSummaryProvider extends Component {
    state = getInitialState(this.props);

    loadData = (getData, getPath) => args => {
        const path = getPath(args);
        this.setState(state => set(state, path, { isLoading: true }));
        getData(args)
            .then(data =>
                this.setState(state =>
                    set(state, path, { data, isLoading: false }),
                ),
            )
            .catch(error =>
                this.setState(state =>
                    set(state, path, { error, isLoading: false }),
                ),
            );
    };

    loadDecadeYear = this.loadData(
        getDecadeYearData,
        ({ to, from }) => `${to}-${from}`,
    );

    loadVolume = this.loadData(getVolumeData, ({ year }) => year);

    loadIssue = this.loadData(getIssueData, ({ year, volume }) => [
        year,
        volume,
    ]);

    loadDocument = this.loadData(getDocumentData, ({ year, volume, issue }) => [
        year,
        volume,
        issue,
    ]);

    render() {
        return <IstexSummaryContext.Provider value={{}} />;
    }
}
