import { render } from '../../../../src/test-utils';
import { TestI18N } from '../../../../src/app/js/i18n/I18NContext';
import { ResourceTitleCell } from './ResourceTitleCell';

describe('ResourceTitleCell', () => {
    it('should render be empty when resourceUri is null', () => {
        const screen = render(
            <TestI18N>
                <ResourceTitleCell
                    row={{
                        resourceUri: '/',
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(screen.container).toBeEmptyDOMElement();
    });

    it('should render be empty when field scope is graphic', () => {
        const screen = render(
            <TestI18N>
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: null,
                        field: {
                            label: 'Field label',
                            scope: 'graphic',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(screen.container).toBeEmptyDOMElement();
    });

    it('should render annotation_resource_not_found message when resource is null', () => {
        const screen = render(
            <TestI18N>
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: null,
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.queryByText('annotation_resource_not_found'),
        ).toBeInTheDocument();
    });

    it('should render the resource title', () => {
        const screen = render(
            <TestI18N>
                <ResourceTitleCell
                    row={{
                        resourceUri: 'uid:/qsdf',
                        resource: {
                            title: 'The resource title',
                            // @ts-expect-error TS2353
                            uri: 'uid:/qsdf',
                        },
                    }}
                />
            </TestI18N>,
        );

        expect(
            screen.queryByText('annotation_resource_not_found'),
        ).not.toBeInTheDocument();

        expect(screen.queryByText('The resource title')).toBeInTheDocument();
    });
});
