import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { render, screen } from '../../../../test-utils';
import Loading from '../../lib/components/Loading';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { ResourceComponent } from './Resource';
import { TestI18N } from '../../i18n/I18NContext';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
// @ts-expect-error TS7016
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

describe('<Resource />', () => {
    const defaultProps = {
        loading: true,
        preLoadResource: () => null,
        preLoadPublication: () => null,
        preLoadExporters: () => null,
        // @ts-expect-error TS7006
        p: { t: (v) => v },
        history: { goBack: () => {}, push: () => {} },
        match: { params: { uri: 'FOO' } },
    };
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        localStorage.clear();
    });

    it('should display Loading if loading prop is true', () => {
        const props = {
            ...defaultProps,
            loading: true,
        };

        const wrapper = render(
            <TestI18N>
                <ResourceComponent {...props} />
            </TestI18N>,
        );
        expect(wrapper.queryByText('loading_resource')).toBeInTheDocument();
    });

    it('should display not found message if no resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
        };

        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <ResourceComponent {...props} />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(wrapper.queryByText('loading_resource')).not.toBeInTheDocument();
        expect(wrapper.queryByText('not_found')).toBeInTheDocument();
    });

    it('should display Detail if resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: {},
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading)).toHaveLength(0);
        expect(wrapper.find('.not-found')).toHaveLength(0);
        expect(wrapper.find(Detail)).toHaveLength(1);
    });

    it('should display RemovedDetail if resource is removed', () => {
        const props = {
            ...defaultProps,
            removed: true,
            loading: false,
            resource: {},
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(RemovedDetail)).toHaveLength(1);
        expect(wrapper.find(Detail)).toHaveLength(0);
    });

    it('should display datasetTitle in link', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: {},
            datasetTitleKey: 'dataset_title',
            characteristics: { dataset_title: 'dataset title' },
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Detail).prop('backToListLabel')).toBe(
            'dataset title',
        );
    });

    it('should call preLoadExporters when the resource component will mount', () => {
        const preLoadExporters = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'uri' } },
            preLoadExporters,
            loading: false,
            resource: {},
        };

        // @ts-expect-error TS2322
        render(<ResourceComponent {...props} />);
        expect(preLoadExporters).toHaveBeenCalledTimes(1);
    });

    it('should call again preLoadResource if the uid uri change in the url', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'uri' } },
            preLoadResource,
            loading: false,
            resource: {},
        };

        // @ts-expect-error TS2322
        const { rerender } = render(<ResourceComponent {...props} />);
        expect(preLoadResource).toHaveBeenCalledTimes(1);

        rerender(
            // @ts-expect-error TS2322
            <ResourceComponent
                {...props}
                match={{ params: { uri: 'changed' } }}
            />,
        );
        expect(preLoadResource).toHaveBeenCalledTimes(2);
    });

    it('should call again preLoadResource if the ark uri change in the url', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { naan: 'naan', rest: 'rest' } },
            preLoadResource,
            loading: false,
            resource: {},
        };

        // @ts-expect-error TS2322
        const { rerender } = render(<ResourceComponent {...props} />);
        expect(preLoadResource).toHaveBeenCalledTimes(1);

        rerender(
            // @ts-expect-error TS2322
            <ResourceComponent
                {...props}
                match={{ params: { naan: 'naan', rest: 'changed' } }}
            />,
        );

        expect(preLoadResource).toHaveBeenCalledTimes(2);
    });

    it('should show the go back main resource when going to subresource for uris', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'GIR65CJ' } },
            preLoadResource,
            loading: false,
            resource: {
                uri: 'resource',
            },
        };

        const theme = createTheme({});
        // @ts-expect-error TS7006
        const TestResourceComponent = (props) => (
            <ThemeProvider theme={theme}>
                <TestI18N>
                    <ResourceComponent {...props} />
                </TestI18N>
            </ThemeProvider>
        );

        const { rerender } = render(<TestResourceComponent {...props} />);

        // Setting last uri state requires a rerender
        rerender(<TestResourceComponent {...props} />);

        expect(
            screen.queryAllByRole('button', {
                name: 'back_to_resource',
            }),
        ).toHaveLength(0);

        rerender(
            <TestResourceComponent
                {...props}
                match={{
                    params: { uri: '38ef9f42fc3de6a85d3c434522c4f510' },
                }}
            />,
        );

        expect(
            screen.getByRole('button', {
                name: 'back_to_resource',
            }),
        ).toBeInTheDocument();
    });

    it('should show the go back main resource when going to subressource for ark ids', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { naan: 'naan', rest: 'rest' } },
            preLoadResource,
            loading: false,
            resource: {
                uri: 'resource',
            },
        };

        const theme = createTheme({});
        // @ts-expect-error TS7006
        const TestResourceComponent = (props) => (
            <ThemeProvider theme={theme}>
                <TestI18N>
                    <ResourceComponent {...props} />
                </TestI18N>
            </ThemeProvider>
        );

        const { rerender } = render(<TestResourceComponent {...props} />);

        // Setting last uri state requires a rerender
        rerender(<TestResourceComponent {...props} />);

        expect(
            screen.queryAllByRole('button', {
                name: 'back_to_resource',
            }),
        ).toHaveLength(0);

        rerender(
            <TestResourceComponent
                {...props}
                match={{
                    params: { uri: '38ef9f42fc3de6a85d3c434522c4f510' },
                }}
            />,
        );

        expect(
            screen.getByRole('button', {
                name: 'back_to_resource',
            }),
        ).toBeInTheDocument();
    });

    it('should store resource uri in local storage', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'uri' } },
            preLoadResource,
            loading: false,
            resource: { uri: 'resource/uri' },
        };

        render(<ResourceComponent {...props} />);
        expect(localStorage.getItem('default-viewed-resources')).toBe(
            '["resource/uri"]',
        );
    });
});
