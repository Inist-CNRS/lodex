import React from 'react';
import { render } from '@testing-library/react';
import { TransformerItem } from './TransformerUpsertDialog';
import '@testing-library/jest-dom';

describe('TransformerUpsertDialog', () => {
    describe('TransformerItem', () => {
        it('should display a link toward the documentation when receiving a doc url', () => {
            const polyglot = {
                t: (key) => key,
            };
            const { queryByLabelText } = render(
                <TransformerItem
                    polyglot={polyglot}
                    name="TRANSFORMER"
                    docUrl="http://doc.lodex.fr/TRANSFORMER"
                />,
            );

            expect(
                queryByLabelText('tooltip_documentation'),
            ).toBeInTheDocument();
            expect(queryByLabelText('tooltip_documentation')).toHaveAttribute(
                'href',
                'http://doc.lodex.fr/TRANSFORMER',
            );
        });
        it('should not display a link toward the documentation when not receiving a doc url', () => {
            const polyglot = {
                t: (key) => key,
            };
            const { queryByLabelText } = render(
                <TransformerItem polyglot={polyglot} name="TRANSFORMER" />,
            );

            expect(
                queryByLabelText('tooltip_documentation'),
            ).not.toBeInTheDocument();
        });
    });
});
