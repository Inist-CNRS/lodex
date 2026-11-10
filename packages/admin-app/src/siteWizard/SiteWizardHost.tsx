import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { URI_FIELD_NAME } from '@lodex/common';
import { fromLoaders, fromParsing, fromPublication } from '../selectors';
import type { State } from '../reducers';
import { SiteWizard, type SiteWizardCloseReason } from './SiteWizard';
import { SiteWizardContext } from './SiteWizardContext';
import {
    isSiteWizardDismissed,
    rememberSiteWizardDismissed,
} from './wizardDismissal';

const hasNoData = (state: State) =>
    fromParsing.isInitialized(state) &&
    !fromParsing.isParsingLoading(state) &&
    fromParsing.canUpload(state);

const getFieldNames = (state: State): string[] =>
    (state as { fields?: { list?: string[] } }).fields?.list ?? [];

// generating a site replaces the model: do not offer it once one was set up
// (an empty instance may still hold the default uri field, and 'new' is the
// field being added). A failed load says nothing about the model.
const hasNoModel = (state: State) =>
    fromPublication.isInitialized(state) &&
    !fromPublication.isPublicationLoading(state) &&
    !fromPublication.hasLoadError(state) &&
    !getFieldNames(state).some(
        (name) => name !== URI_FIELD_NAME && name !== 'new',
    );

// the displayable models depend on the loaders: without them, the wizard
// would briefly say that no model is available
const shouldOpenByItself = (state: State) =>
    hasNoData(state) &&
    hasNoModel(state) &&
    fromLoaders.areLoadersLoaded(state);

// opened by the instance itself or from the data screen, until closed
type WizardRequest = 'auto' | 'open' | 'closed';

type SiteWizardHostProps = {
    // whether the current screen is the one offering the wizard
    active: boolean;
    children: ReactNode;
};

/**
 * Keeps the site wizard mounted above the data screens: the data screen is
 * unmounted whenever the parsing result reloads, which happens while the
 * generated site imports its data.
 *
 * Once open, the wizard stays open until the user closes it or the
 * generation succeeds, whatever the generation changes in the instance
 * (model imported, data partially saved...).
 */
export const SiteWizardHost = ({ active, children }: SiteWizardHostProps) => {
    const opensByItself = useSelector(shouldOpenByItself);
    const [request, setRequest] = useState<WizardRequest>(() =>
        isSiteWizardDismissed() ? 'closed' : 'auto',
    );
    const [wizardKey, setWizardKey] = useState(0);

    if (request === 'auto' && active && opensByItself) {
        setRequest('open');
    }

    const openWizard = useCallback(() => {
        // a new key remounts the wizard so that it restarts empty
        setWizardKey((key) => key + 1);
        setRequest('open');
    }, []);
    const handleClose = (reason: SiteWizardCloseReason) => {
        if (reason === 'dismissed') {
            rememberSiteWizardDismissed();
        }
        setRequest('closed');
    };

    const contextValue = useMemo(() => ({ openWizard }), [openWizard]);

    return (
        <SiteWizardContext.Provider value={contextValue}>
            {children}
            <SiteWizard
                key={wizardKey}
                open={active && request === 'open'}
                onClose={handleClose}
            />
        </SiteWizardContext.Provider>
    );
};
