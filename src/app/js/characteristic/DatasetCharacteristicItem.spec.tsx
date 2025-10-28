import { DatasetCharacteristicItemComponent as DatasetCharacteristicItem } from './DatasetCharacteristicItem';
import Property from '../../../../packages/public-app/src/Property';

import { useInView } from 'react-intersection-observer';
import { render } from '../../../test-utils';
jest.mock('react-intersection-observer');

jest.mock('../../../../packages/public-app/src/Property', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked Property</div>),
}));

describe('DatasetCharacteristicItem', () => {
    it('should not render a Property when it is not visible', () => {
        // @ts-expect-error TS2339
        useInView.mockImplementation(() => [null, false]);

        const props = {
            field: { name: 'field1', scheme: 'scheme1' },
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
            characteristic: { name: 'field1' },
        };

        // @ts-expect-error TS2741
        const screen = render(<DatasetCharacteristicItem {...props} />, {
            initialState: {
                field: {
                    list: ['field1'],
                    byName: {
                        field1: { name: 'field1', scheme: 'scheme1' },
                    },
                },
                characteristic: {
                    characteristics: [
                        {
                            field1: 'value1',
                            field2: 'value2',
                        },
                    ],
                },
            },
        });

        expect(screen.queryByText('Mocked Property')).not.toBeInTheDocument();
    });

    it('should render a Property when it is visible', () => {
        // @ts-expect-error TS2339
        useInView.mockImplementation(() => [null, true]);

        const props = {
            field: { name: 'field1', scheme: 'scheme1' },
            resource: {
                field1: 'value1',
                field2: 'value2',
            },
            characteristic: { name: 'field1' },
        };

        // @ts-expect-error TS2741
        const screen = render(<DatasetCharacteristicItem {...props} />, {
            initialState: {
                fields: {
                    list: ['field1'],
                    byName: {
                        field1: { name: 'field1', scheme: 'scheme1' },
                    },
                },
                characteristic: {
                    characteristics: [
                        {
                            field1: 'value1',
                            field2: 'value2',
                        },
                    ],
                },
            },
        });

        expect(screen.getByText('Mocked Property')).toBeInTheDocument();
        expect(Property).toHaveBeenCalledWith(
            expect.objectContaining({
                field: { name: 'field1', scheme: 'scheme1' },
                resource: {
                    name: 'field1',
                    field1: 'value1',
                    field2: 'value2',
                },
            }),
            {},
        );
    });
});
