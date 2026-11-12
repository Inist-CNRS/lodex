// The theme variable holding the site name: ISTEX themes call it "title"
export const getSiteTitleKey = (themeVariables: Record<string, unknown>) =>
    'title' in themeVariables ? 'title' : 'siteTitle';
