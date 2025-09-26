// @ts-expect-error TS7006
export default function choose(locale) {
    // @ts-expect-error TS2304
    return locale === 'fr' || locale === 'fr-FR' ? __FR__ : __EN__;
}
