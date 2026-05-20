import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import type { Field } from '../../../fields/types';

const StyledDiv = styled.div`
    ${(props) => props.css}
`;

interface CSSViewProps {
    field: Field;
    resource: object;
    template: string;
    globalMode: boolean;
}

const CSSView = ({ resource, field, template, globalMode }: CSSViewProps) => {
    // @ts-expect-error TS7053
    const value = resource[field.name];
    const rules = template.trim().slice(1, -1);
    if (globalMode) {
        return (
            <div>
                <Global
                    styles={css`
                        ${rules}
                    `}
                />
                {value}
            </div>
        );
    }
    return <StyledDiv css={rules}>{value}</StyledDiv>;
};

export default CSSView;
