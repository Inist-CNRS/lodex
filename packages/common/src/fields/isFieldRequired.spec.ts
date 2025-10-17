import isFieldRequired from './isFieldRequired';
import { Overview } from '../overview';

describe('isFieldRequired', () => {
    it('should return "false" if the field is "null", "undefined" or an "empty object"', () => {
        expect(isFieldRequired(null)).toBe(false);
        expect(isFieldRequired(undefined)).toBe(false);
    });

    it('should return "false" if the field overview is "NONE"', () => {
        const field = {
            overview: Overview.NONE,
        };
        expect(isFieldRequired(field)).toBe(false);
    });

    it('should return "true" if the field overview is not NONE', () => {
        const fieldTitle = {
            overview: Overview.RESOURCE_TITLE,
        };
        expect(isFieldRequired(fieldTitle)).toBe(true);

        const fieldSubresourceTitle = {
            overview: Overview.SUBRESOURCE_TITLE,
        };
        expect(isFieldRequired(fieldSubresourceTitle)).toBe(true);

        const fieldDescription = {
            overview: Overview.RESOURCE_DESCRIPTION,
        };
        expect(isFieldRequired(fieldDescription)).toBe(true);

        const fieldDetail1 = {
            overview: Overview.RESOURCE_DETAIL_1,
        };
        expect(isFieldRequired(fieldDetail1)).toBe(true);

        const fieldDetail2 = {
            overview: Overview.RESOURCE_DETAIL_2,
        };
        expect(isFieldRequired(fieldDetail2)).toBe(true);
    });
});
