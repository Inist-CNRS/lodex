export default function choose(locale) {
    return locale === 'fr' || locale === 'fr-FR' ? __FR__ : __EN__;
}
