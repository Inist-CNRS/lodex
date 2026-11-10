import { createContext } from 'react';

// lets the data screens reopen the site wizard hosted by SiteWizardHost
export const SiteWizardContext = createContext<{ openWizard?: () => void }>({});
