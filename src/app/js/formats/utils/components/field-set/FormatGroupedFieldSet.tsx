import type { ReactNode } from 'react';

type FormatGroupedFieldSetProps = {
    children: ReactNode;
};

const FormatGroupedFieldSet = ({ children }: FormatGroupedFieldSetProps) => {
    return <div>{children}</div>;
};

export default FormatGroupedFieldSet;
