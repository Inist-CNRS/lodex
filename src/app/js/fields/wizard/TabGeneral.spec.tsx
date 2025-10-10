import type { ReactNode } from 'react';
import TabGeneral from './TabGeneral';
import { mount } from 'enzyme';
import { FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router-dom';
import SourceValueToggle from '../sourceValue/SourceValueToggle.tsx';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import configureStore from '../../configureStore.ts';
import reducers from '../../admin/reducers.ts';

describe('TabGeneral', () => {
    // @ts-expect-error TS7017
    global.__DEBUG__ = false;
    const memoryHistory = createMemoryHistory();
    const { store } = configureStore(
        reducers,
        function* sagas() {},
        {},
        memoryHistory,
    );

    const TestForm = ({ children }: { children: ReactNode }) => {
        const form = useForm();
        return <FormProvider {...form}>{children}</FormProvider>;
    };

    const Wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <MemoryRouter>
                <TestForm>{children}</TestForm>
            </MemoryRouter>
        </Provider>
    );

    describe('SourceValue', () => {
        const defaultProps = {
            subresourceUri: undefined,
            arbitraryMode: false,
        };

        it('should render TabGeneral with all values when is resource field', () => {
            const wrapper = mount(
                // @ts-expect-error TS2769
                <Wrapper>
                    <TabGeneral {...defaultProps} />
                </Wrapper>,
            );
            expect(wrapper.find(SourceValueToggle)).toHaveLength(1);
        });
    });
});
