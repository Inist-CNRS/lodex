import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import type { CustomNodeElementProps } from 'react-d3-tree';
import { render } from '../../../test-utils';
import { HierarchicalTreeNode } from './HierarchicalTreeNode';

const mockSelectOne = jest.fn();

jest.mock('../../../search/useSearchPaneContext', () => ({
    useSearchPaneContextOrDefault: jest.fn(() => ({
        filters: [],
        selectOne: mockSelectOne,
    })),
}));

const createMockNodeDatum = (
    name: string,
    attributes?: Record<string, string | number | boolean>,
    depth: number = 0,
): CustomNodeElementProps['nodeDatum'] => ({
    name,
    attributes,
    children: [],
    __rd3t: {
        id: 'test-id',
        depth,
        collapsed: false,
    },
});

const defaultProps = {
    orientation: 'horizontal' as const,
    width: 200,
    height: 100,
    getNodeColor: jest.fn(() => '#000000'),
    toggleNode: jest.fn(),
    nodeDatum: createMockNodeDatum('TestNode'),
    hierarchyPointNode: {} as CustomNodeElementProps['hierarchyPointNode'],
    onNodeClick: jest.fn(),
    onNodeMouseOut: jest.fn(),
    onNodeMouseOver: jest.fn(),
    addChildren: jest.fn(),
};

describe('<HierarchicalTreeNode />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            description: 'with title override',
            nodeDatum: createMockNodeDatum('TestNode', {
                title: 'Custom Title',
            }),
            expected: 'Custom Title',
        },
        {
            description: 'with node name when no title',
            nodeDatum: createMockNodeDatum('TestNode'),
            expected: 'TestNode',
        },
        {
            description: 'with node name when title is not a string',
            nodeDatum: createMockNodeDatum('TestNode', { title: 123 }),
            expected: 'TestNode',
        },
    ])('should display group title $description', ({ nodeDatum, expected }) => {
        render(
            <svg>
                <HierarchicalTreeNode {...defaultProps} nodeDatum={nodeDatum} />
            </svg>,
        );

        const group = screen.getByRole('group', { name: expected });
        expect(group).toBeInTheDocument();
        expect(
            screen.getByText(expected, { selector: 'span' }),
        ).toBeInTheDocument();
    });

    it.each([
        {
            description: 'with SearchPaneContext and title override',
            nodeDatum: createMockNodeDatum(
                'TestNode',
                {
                    title: 'Custom Title',
                },
                1,
            ),
            fieldToFilter: 'testField',
            expectedValue: 'Custom Title',
            shouldCallSelectOne: true,
        },
        {
            description: 'with SearchPaneContext and node name',
            nodeDatum: createMockNodeDatum('TestNode', undefined, 1),
            fieldToFilter: 'testField',
            expectedValue: 'TestNode',
            shouldCallSelectOne: true,
        },
        {
            description: 'without SearchPaneContext (no fieldToFilter)',
            nodeDatum: createMockNodeDatum(
                'TestNode',
                {
                    title: 'Custom Title',
                },
                1,
            ),
            fieldToFilter: undefined,
            expectedValue: 'Custom Title',
            shouldCallSelectOne: false,
        },
        {
            description:
                'without SearchPaneContext and node name (no fieldToFilter)',
            nodeDatum: createMockNodeDatum('TestNode', undefined, 1),
            fieldToFilter: null,
            expectedValue: 'TestNode',
            shouldCallSelectOne: false,
        },
    ])(
        'should handle click $description',
        ({ nodeDatum, fieldToFilter, expectedValue, shouldCallSelectOne }) => {
            const onNodeClick = jest.fn();

            render(
                <svg>
                    <HierarchicalTreeNode
                        {...defaultProps}
                        nodeDatum={nodeDatum}
                        fieldToFilter={fieldToFilter}
                        onNodeClick={onNodeClick}
                    />
                </svg>,
            );

            const container = screen.getByRole('treeitem');
            fireEvent.click(container);

            if (shouldCallSelectOne) {
                expect(mockSelectOne).toHaveBeenCalledWith({
                    fieldName: fieldToFilter,
                    value: expectedValue,
                });
            } else {
                expect(mockSelectOne).not.toHaveBeenCalled();
            }

            expect(onNodeClick).toHaveBeenCalledTimes(1);
        },
    );

    it('should not select root node (depth 0)', () => {
        const onNodeClick = jest.fn();
        const nodeDatum = createMockNodeDatum('RootNode', undefined, 0);

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    nodeDatum={nodeDatum}
                    fieldToFilter="testField"
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        expect(mockSelectOne).not.toHaveBeenCalled();
        expect(onNodeClick).toHaveBeenCalledTimes(1);
    });

    it('should not select root node with title override (depth 0)', () => {
        const onNodeClick = jest.fn();
        const nodeDatum = createMockNodeDatum(
            'RootNode',
            { title: 'Root Title' },
            0,
        );

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    nodeDatum={nodeDatum}
                    fieldToFilter="testField"
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        expect(mockSelectOne).not.toHaveBeenCalled();
        expect(onNodeClick).toHaveBeenCalledTimes(1);
    });

    it.each([
        {
            description: 'child node (depth 1)',
            nodeDatum: createMockNodeDatum('ChildNode', undefined, 1),
        },
        {
            description: 'grandchild node (depth 2)',
            nodeDatum: createMockNodeDatum('GrandchildNode', undefined, 2),
        },
        {
            description: 'child node with title override (depth 1)',
            nodeDatum: createMockNodeDatum(
                'ChildNode',
                { title: 'Child Title' },
                1,
            ),
        },
    ])('should select $description', ({ nodeDatum }) => {
        const onNodeClick = jest.fn();

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    nodeDatum={nodeDatum}
                    fieldToFilter="testField"
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        const expectedValue =
            typeof nodeDatum.attributes?.title === 'string'
                ? nodeDatum.attributes.title
                : nodeDatum.name;
        expect(mockSelectOne).toHaveBeenCalledWith({
            fieldName: 'testField',
            value: expectedValue,
        });
        expect(onNodeClick).toHaveBeenCalledTimes(1);
    });

    it('should call onNodeClick when clicking on the node', () => {
        const onNodeClick = jest.fn();

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(onNodeClick).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'click',
            }),
        );
    });

    it('should not throw error when onNodeClick is not provided', () => {
        render(
            <svg>
                <HierarchicalTreeNode {...defaultProps} />
            </svg>,
        );

        const container = screen.getByRole('treeitem');

        expect(() => {
            fireEvent.click(container);
        }).not.toThrow();
    });

    it('should call onNodeClick even when fieldToFilter is not provided', () => {
        const onNodeClick = jest.fn();

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    onNodeClick={onNodeClick}
                    fieldToFilter={undefined}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(mockSelectOne).not.toHaveBeenCalled();
    });

    it('should stop event propagation when clicking', () => {
        const onNodeClick = jest.fn();
        const outerClickHandler = jest.fn();

        render(
            <svg onClick={outerClickHandler}>
                <HierarchicalTreeNode
                    {...defaultProps}
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const treeitem = screen.getByRole('treeitem');
        fireEvent.click(treeitem);

        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(outerClickHandler).not.toHaveBeenCalled();
    });
});
