import { render } from '@testing-library/react';
import { TransformerItem } from './TransformerUpsertDialog';

describe('TransformerUpsertDialog', () => {
    describe('TransformerItem', () => {
        it('should display a link toward the documentation when receiving a doc url', () => {
            const polyglot = {
                // @ts-expect-error TS7006
                t: (key) => key,
            };
            const { queryByLabelText } = render(
                // @ts-expect-error TS2741
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
                // @ts-expect-error TS7006
                t: (key) => key,
            };
            const { queryByLabelText } = render(
                // @ts-expect-error TS2739
                <TransformerItem polyglot={polyglot} name="TRANSFORMER" />,
            );

            expect(
                queryByLabelText('tooltip_documentation'),
            ).not.toBeInTheDocument();
        });
    });
});
