import phraseEN from './en';
import phraseFR from './fr';

export default function choose(locale) {
    return locale === 'fr' || locale === 'fr-FR' ? phraseFR() : phraseEN();
}
