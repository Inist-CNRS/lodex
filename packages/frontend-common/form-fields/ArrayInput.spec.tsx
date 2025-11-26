import { act, screen } from '@testing-library/react';
import React from 'react';
import { render, userEvent } from '../test-utils';
import { ArrayInput, type ArrayInputComponentProps } from './ArrayInput';

if (typeof structuredClone === 'undefined') {
    global.structuredClone = (obj: unknown) => {
        if (obj === undefined) return undefined;
        return JSON.parse(JSON.stringify(obj));
    };
}

const TestComponent = ({
    value,
    onChange,
}: ArrayInputComponentProps<string>) => (
    <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label="test-input"
    />
);

describe('ArrayInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty array', () => {
        render(
            <ArrayInput
                Component={TestComponent}
                values={[]}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.queryAllByRole('textbox', { name: 'test-input' }).length,
        ).toEqual(0);
        expect(
            screen.getByRole('button', { name: 'add_value' }),
        ).toBeInTheDocument();
    });

    it.each([
        {
            description: 'one element',
            values: ['test1'],
            expectedCount: 1,
            expectedValues: ['test1'],
        },
        {
            description: 'multiple elements',
            values: ['test1', 'test2', 'test3'],
            expectedCount: 3,
            expectedValues: ['test1', 'test2', 'test3'],
        },
    ])(
        'should render array with $description',
        ({ values, expectedCount, expectedValues }) => {
            render(
                <ArrayInput
                    Component={TestComponent}
                    values={values}
                    onChange={mockOnChange}
                />,
            );

            const inputs = screen.getAllByRole('textbox', {
                name: 'test-input',
            });
            expect(inputs.length).toBe(expectedCount);
            expectedValues.forEach((expectedValue, index) => {
                expect(inputs[index]).toHaveValue(expectedValue);
            });
        },
    );

    it('should render remove button for each element', () => {
        render(
            <ArrayInput
                Component={TestComponent}
                values={['test1', 'test2']}
                onChange={mockOnChange}
            />,
        );

        expect(screen.getAllByRole('button', { name: 'remove' }).length).toBe(
            2,
        );
    });

    it('should render array with undefined values', () => {
        render(
            <ArrayInput
                Component={TestComponent}
                values={[undefined, 'test2', undefined]}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(3);
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' })[0],
        ).toHaveValue('');
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' })[1],
        ).toHaveValue('test2');
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' })[2],
        ).toHaveValue('');
    });

    it('should add a new value when clicking add button', async () => {
        const user = userEvent.setup();
        render(
            <ArrayInput
                Component={TestComponent}
                values={['test1']}
                onChange={mockOnChange}
            />,
        );

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(['test1', undefined]);
    });

    it('should add a new value with custom defaultValue', async () => {
        const user = userEvent.setup();
        render(
            <ArrayInput
                Component={TestComponent}
                values={['test1']}
                onChange={mockOnChange}
                defaultValue="default"
            />,
        );

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(['test1', 'default']);
    });

    it('should add multiple values sequentially', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [values, setValues] = React.useState<(string | undefined)[]>([
                'test1',
            ]);
            return (
                <ArrayInput
                    Component={TestComponent}
                    values={values}
                    onChange={setValues}
                />
            );
        };

        render(<TestWrapper />);

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(2);

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(3);
    });

    it('should properly clone defaultValue to avoid reference sharing', async () => {
        const user = userEvent.setup();
        const defaultValue = { nested: 'value' };
        type TestValueType = typeof defaultValue;

        const ObjectTestComponent = ({
            value: value,
            onChange,
        }: ArrayInputComponentProps<TestValueType>) => (
            <input
                type="text"
                value={value?.nested || ''}
                onChange={(e) => onChange({ nested: e.target.value })}
                aria-label="test-input"
            />
        );

        render(
            <ArrayInput<TestValueType>
                Component={ObjectTestComponent}
                values={[]}
                onChange={mockOnChange}
                defaultValue={defaultValue}
            />,
        );

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        expect(mockOnChange).toHaveBeenNthCalledWith(1, [{ nested: 'value' }]);
    });

    it.each([
        {
            description: 'middle element',
            initialValues: ['test1', 'test2', 'test3'],
            removeIndex: 1,
            expectedResult: ['test1', 'test3'],
        },
        {
            description: 'first element',
            initialValues: ['test1', 'test2'],
            removeIndex: 0,
            expectedResult: ['test2'],
        },
        {
            description: 'last element',
            initialValues: ['test1', 'test2'],
            removeIndex: 1,
            expectedResult: ['test1'],
        },
    ])(
        'should remove $description',
        async ({ initialValues, removeIndex, expectedResult }) => {
            const user = userEvent.setup();
            render(
                <ArrayInput
                    Component={TestComponent}
                    values={initialValues}
                    onChange={mockOnChange}
                />,
            );

            await act(async () => {
                await user.click(
                    screen.getAllByRole('button', {
                        name: 'remove',
                    })[removeIndex],
                );
            });

            expect(mockOnChange).toHaveBeenCalledWith(expectedResult);
        },
    );

    it('should remove all values', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [values, setValues] = React.useState<(string | undefined)[]>([
                'test1',
                'test2',
            ]);
            return (
                <ArrayInput
                    Component={TestComponent}
                    values={values}
                    onChange={setValues}
                />
            );
        };

        render(<TestWrapper />);

        let removeButtons = screen.getAllByRole('button', { name: 'remove' });
        await act(async () => {
            await user.click(removeButtons[0]);
        });

        removeButtons = screen.getAllByRole('button', { name: 'remove' });
        await act(async () => {
            await user.click(removeButtons[0]);
        });

        expect(
            screen.queryAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(0);
    });

    it.each([
        {
            description: 'first input',
            initialValues: ['test1', 'test2'],
            inputIndex: 0,
            typedChar: 'X',
            expectedValues: ['test1X', 'test2'],
        },
        {
            description: 'second input',
            initialValues: ['test1', 'test2', 'test3'],
            inputIndex: 1,
            typedChar: 'Y',
            expectedValues: ['test1', 'test2Y', 'test3'],
        },
    ])(
        'should update value when $description changes',
        async ({ initialValues, inputIndex, typedChar, expectedValues }) => {
            const user = userEvent.setup();
            render(
                <ArrayInput
                    Component={TestComponent}
                    values={initialValues}
                    onChange={mockOnChange}
                />,
            );

            await act(async () => {
                await user.type(
                    screen.getAllByRole('textbox', {
                        name: 'test-input',
                    })[inputIndex],
                    typedChar,
                );
            });

            expect(mockOnChange).toHaveBeenLastCalledWith(expectedValues);
        },
    );

    it('should allow setting value to undefined', async () => {
        const user = userEvent.setup();
        const TestComponentAllowingUndefined = ({
            value: value,
            onChange,
        }: ArrayInputComponentProps<string>) => (
            <button
                onClick={() => onChange(undefined)}
                aria-label="set-undefined"
            >
                {value || 'undefined'}
            </button>
        );

        render(
            <ArrayInput
                Component={TestComponentAllowingUndefined}
                values={['test1', 'test2']}
                onChange={mockOnChange}
            />,
        );

        await act(async () => {
            await user.click(
                screen.getAllByRole('button', {
                    name: 'set-undefined',
                })[0],
            );
        });

        expect(mockOnChange).toHaveBeenCalledWith([undefined, 'test2']);
    });

    it('should pass value and onChange props to child components', () => {
        render(
            <ArrayInput
                Component={TestComponent}
                values={['value1', 'value2']}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.getAllByRole('textbox', { name: 'test-input' })[0],
        ).toHaveValue('value1');
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' })[1],
        ).toHaveValue('value2');
    });

    it('should call onChange with updated values when child component changes', async () => {
        const user = userEvent.setup();
        render(
            <ArrayInput
                Component={TestComponent}
                values={['test1', 'test2']}
                onChange={mockOnChange}
            />,
        );

        await act(async () => {
            return user.type(
                screen.getAllByRole('textbox', { name: 'test-input' })[0],
                'X',
            );
        });

        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenLastCalledWith(['test1X', 'test2']);
    });

    it('should handle adding and removing in sequence', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [values, setValues] = React.useState<(string | undefined)[]>([
                'test1',
            ]);
            return (
                <ArrayInput
                    Component={TestComponent}
                    values={values}
                    onChange={setValues}
                />
            );
        };

        render(<TestWrapper />);

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(2);

        await act(async () => {
            await user.click(
                screen.getAllByRole('button', { name: 'remove' })[0],
            );
        });
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(1);

        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'add_value' }));
        });
        expect(
            screen.getAllByRole('textbox', { name: 'test-input' }).length,
        ).toBe(3);
    });

    it('should handle object values', () => {
        type ObjectValue = { name: string; age: number };

        const ObjectComponent = ({
            value: value,
            onChange,
        }: ArrayInputComponentProps<ObjectValue>) => (
            <div>
                <input
                    type="text"
                    value={value?.name || ''}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            name: e.target.value,
                        } as ObjectValue)
                    }
                    aria-label="name-input"
                />
                <input
                    type="number"
                    value={value?.age || 0}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            age: parseInt(e.target.value),
                        } as ObjectValue)
                    }
                    aria-label="age-input"
                />
            </div>
        );

        render(
            <ArrayInput
                Component={ObjectComponent}
                values={[
                    { name: 'Alice', age: 30 },
                    { name: 'Bob', age: 25 },
                ]}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.getAllByRole('textbox', {
                name: 'name-input',
            })[0],
        ).toHaveValue('Alice');
        expect(
            screen.getAllByRole('textbox', {
                name: 'name-input',
            })[1],
        ).toHaveValue('Bob');

        expect(
            screen.getAllByRole('spinbutton', {
                name: 'age-input',
            })[0],
        ).toHaveValue(30);
        expect(
            screen.getAllByRole('spinbutton', {
                name: 'age-input',
            })[1],
        ).toHaveValue(25);
    });
});
