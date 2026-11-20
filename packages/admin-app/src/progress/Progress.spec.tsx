import { shallow } from 'enzyme';
import { Dialog } from '@mui/material';

import { ProgressComponent as Progress } from './Progress';
import { ProgressStatus } from '@lodex/common';
import { render } from '../test-utils';
import fetch from '@lodex/frontend-common/fetch/fetch';

jest.mock('@lodex/frontend-common/fetch/fetch');

// @ts-expect-error TS7006
const identity = (x) => x;

describe('Progress', () => {
    const defaultProps = {
        loadProgress: () => null,
        clearProgress: () => null,
        progress: {
            status: ProgressStatus.STARTING,
            target: 0,
            progress: 0,
        },
        p: {
            t: identity,
            tc: identity,
            tu: identity,
            tm: identity,
        },
    };

    it('should render closed dialog if status is PENDING', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                status: ProgressStatus.PENDING,
            },
        };
        const wrapper = shallow(<Progress {...props} />);

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(false);
    });

    it('should render opened dialog if status is not PENDING', () => {
        const wrapper = shallow(<Progress {...defaultProps} />);

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(true);
    });

    it('should render progressBar', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: 1000,
                progress: 700,
            },
        };
        const screen = render(<Progress {...props} />);

        expect(screen.getByText('700 / 1000')).toBeInTheDocument();
    });

    it('should render progress with no target', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: null,
                progress: 700,
            },
        };
        const screen = render(<Progress {...props} />);
        expect(screen.getByText('700')).toBeInTheDocument();
    });

    it('should render progress with no target and text', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: null,
                progress: 700,
                label: 'lines',
            },
        };
        const screen = render(<Progress {...props} />);
        expect(screen.getByText('700 lines')).toBeInTheDocument();
    });

    it('should render the symbol if specified', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: 100,
                progress: 70,
                symbol: '%',
            },
        };
        const screen = render(<Progress {...props} />);

        expect(screen.getByText('70 / 100 %')).toBeInTheDocument();
    });
});

describe('Progress on load', () => {
    const fetchMock = fetch as unknown as jest.Mock;

    beforeEach(() => {
        fetchMock.mockReset();
    });

    const props = {
        loadProgress: () => null,
        clearProgress: () => null,
        progress: { status: ProgressStatus.PENDING },
    };

    it('should show a job already running when the page loads', async () => {
        fetchMock.mockResolvedValue({
            response: {
                status: ProgressStatus.INDEXATION,
                target: 1000,
                progress: 700,
                isBackground: false,
            },
        });
        const screen = render(
            <Progress {...props} progressRequest={{ url: '/api/progress' }} />,
        );

        expect(await screen.findByText('700 / 1000')).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith({ url: '/api/progress' });
    });

    it('should not ask for the progress when logged out', () => {
        render(<Progress {...props} />);

        expect(fetchMock).not.toHaveBeenCalled();
    });
});
