import { render } from '../../../../test-utils';
import { TransformerItem } from './TransformerUpsertDialog';

describe('TransformerUpsertDialog', () => {
    describe('TransformerItem', () => {
        it('should display a link toward the documentation when receiving a doc url', () => {
            const { queryByLabelText } = render(
                <TransformerItem
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
            const { queryByLabelText } = render(
                <TransformerItem name="TRANSFORMER" />,
            );

            expect(
                queryByLabelText('tooltip_documentation'),
            ).not.toBeInTheDocument();
        });
    });
});
