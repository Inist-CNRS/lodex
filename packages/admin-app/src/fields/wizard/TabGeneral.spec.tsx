import type { ReactNode } from 'react';
import TabGeneral from './TabGeneral.tsx';
import { mount } from 'enzyme';
import { FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router-dom';
import SourceValueToggle from '../sourceValue/SourceValueToggle';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import configureStore from '@lodex/frontend-common/configureStore.ts';
import reducers from '../../reducers.ts';

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
                <Wrapper>
                    <TabGeneral {...defaultProps} />
                </Wrapper>,
            );
            expect(wrapper.find(SourceValueToggle)).toHaveLength(1);
        });
    });
});
