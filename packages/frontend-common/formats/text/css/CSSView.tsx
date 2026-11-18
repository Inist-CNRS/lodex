import type { ReactNode } from 'react';
import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import type { Field } from '../../../fields/types';

const StyledDiv = styled('div', {
    shouldForwardProp: (prop) => prop !== 'rules',
})<{ rules: string }>`
    ${(props) => props.rules}
`;

// Le nom de la variable CSS est dérivé du nom du champ, en ne gardant que
// les caractères sûrs pour un identifiant CSS.
const toCssVarName = (name: string) =>
    `--${name.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

// Retire les caractères permettant de sortir de la déclaration
// (fin de propriété, accolades, balises) pour éviter l'injection de règles.
const sanitizeCssValue = (value: unknown) =>
    String(value ?? '').replace(/[;{}<>]/g, '');

interface CSSViewProps {
    field: Field;
    resource: Record<string, unknown>;
    template: string;
    globalMode: boolean;
}

const CSSView = ({ resource, field, template, globalMode }: CSSViewProps) => {
    const trimmed = template.trim();
    const rules =
        trimmed.startsWith('{') && trimmed.endsWith('}')
            ? trimmed.slice(1, -1)
            : trimmed;

    // Mode global : aucun nœud DOM, uniquement l'injection de styles.
    // Si le champ est vide, rien n'est injecté.
    if (globalMode) {
        const varValue = sanitizeCssValue(resource[field.name]).trim();
        if (!varValue) {
            return null;
        }
        return (
            <Global
                styles={`:root { ${toCssVarName(field.name)}: ${varValue}; } ${rules}`}
            />
        );
    }

    // Mode scopé : le CSS s'applique à la div qui affiche la valeur.
    const value = resource[field.name] as ReactNode;
    return <StyledDiv rules={rules}>{value}</StyledDiv>;
};

export default CSSView;
