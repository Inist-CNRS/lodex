import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { isSiteGenerationActive, URI_FIELD_NAME } from '@lodex/common';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import {
    fromLoaders,
    fromParsing,
    fromPublication,
    fromUpload,
} from '../selectors';
import type { State } from '../reducers';
import { useSiteGeneration } from '../siteGeneration/useSiteGeneration';
import { SiteWizard, type SiteWizardCloseReason } from './SiteWizard';
import { SiteWizardContext } from './SiteWizardContext';
import {
    forgetSiteWizardDismissed,
    isSiteWizardDismissed,
    rememberSiteWizardDismissed,
} from './wizardDismissal';

const hasNoData = (state: State) =>
    fromParsing.isInitialized(state) &&
    !fromParsing.isParsingLoading(state) &&
    fromParsing.canUpload(state);

// generating a site replaces the model: do not offer it once one was set up
// (an empty instance may still hold the default uri field, and 'new' is the
// field being added). A failed load says nothing about the model.
const hasNoModel = (state: State) =>
    fromPublication.isInitialized(state) &&
    !fromPublication.isPublicationLoading(state) &&
    !fromPublication.hasLoadError(state) &&
    !fromFields
        .getFieldNames(state)
        .some((name) => name !== URI_FIELD_NAME && name !== 'new');

// the displayable models depend on the loaders: without them, the wizard
// would briefly say that no model is available
const shouldOpenByItself = (state: State) =>
    hasNoData(state) &&
    hasNoModel(state) &&
    fromLoaders.areLoadersLoaded(state);

// set by the progress dialog when a failed data import is retried
export type SiteWizardLocationState = { reopenSiteWizard?: boolean };

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
 * upload is handed over to the progress dialog, whatever the generation changes in the instance
 * (model imported, data partially saved...).
 */
export const SiteWizardHost = ({ active, children }: SiteWizardHostProps) => {
    const instanceIsEmpty = useSelector(shouldOpenByItself);
    // only the manual import screen uploads through the store; its upload
    // stays pending until the end of its import
    const manualImportStatus = useSelector(
        (state: State) => fromUpload.getUpload(state).status,
    );
    // the dismissal remembered for the manual import, not by the user
    const isDismissedByImport = useRef(false);
    const { generation } = useSiteGeneration();
    const [request, setRequest] = useState<WizardRequest>(() =>
        isSiteWizardDismissed() ? 'closed' : 'auto',
    );
    const [wizardKey, setWizardKey] = useState(0);
    const hasSeenActiveGeneration = useRef(false);
    const history = useHistory();
    const location = useLocation<SiteWizardLocationState | undefined>();
    const isReopenRequested = !!location.state?.reopenSiteWizard;

    // the progress dialog shows an active generation: the wizard must not
    // hide it (undefined: the generation is not known yet)
    const isGenerationActive = isSiteGenerationActive(generation?.status);
    if (isGenerationActive) {
        hasSeenActiveGeneration.current = true;
    }
    // a reload during the data import shows an empty instance: the wizard
    // waits for the end of the generation. A site generated meanwhile looks
    // empty until the instance is reloaded: it does not open the wizard.
    const opensByItself =
        instanceIsEmpty &&
        generation !== undefined &&
        !isGenerationActive &&
        !(hasSeenActiveGeneration.current && generation?.status === 'done');

    // a manual import creates no site generation: the instance looks empty
    // until its data is saved, and a reload meanwhile would open the wizard.
    // A failed or cancelled one leaves the instance empty: the wizard may
    // open by itself again.
    useEffect(() => {
        if (manualImportStatus === 'PENDING' && !isSiteWizardDismissed()) {
            rememberSiteWizardDismissed();
            isDismissedByImport.current = true;
        }
        if (manualImportStatus === 'ERROR' && isDismissedByImport.current) {
            forgetSiteWizardDismissed();
        }
        if (manualImportStatus !== 'PENDING') {
            isDismissedByImport.current = false;
        }
    }, [manualImportStatus]);

    if (request === 'auto' && active && opensByItself) {
        setRequest('open');
    }

    const openWizard = useCallback(() => {
        // a new key remounts the wizard so that it restarts empty
        setWizardKey((key) => key + 1);
        setRequest('open');
    }, []);
    // a failed data import asks to send the data anew: the wizard reopens as
    // it was left (same key). The request is then removed from the history
    // entry, so that a reload or a back does not reopen the wizard.
    useEffect(() => {
        if (!isReopenRequested) {
            return;
        }
        setRequest('open');
        const { reopenSiteWizard: _, ...state } = location.state ?? {};
        history.replace({
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
            state,
        });
    }, [isReopenRequested, location, history]);
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
