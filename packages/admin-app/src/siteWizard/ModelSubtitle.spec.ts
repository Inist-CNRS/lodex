import { getModelNameInSentence } from './ModelSubtitle';

describe('getModelNameInSentence', () => {
    it('lowercases the leading "Modèle" in French', () => {
        expect(getModelNameInSentence('Modèle OpenAlex', 'fr')).toBe(
            'modèle OpenAlex',
        );
    });

    it('keeps English titles, which start with the model name', () => {
        expect(getModelNameInSentence('OpenAlex model', 'en')).toBe(
            'OpenAlex model',
        );
        expect(getModelNameInSentence('Thèses.fr model', 'en')).toBe(
            'Thèses.fr model',
        );
    });
});
