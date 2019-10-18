import isFieldRequired from './isFieldRequired';
import {
    NONE,
    RESOURCE_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
} from '../overview';

describe('isFieldRequired', () => {
    it('should return "false" if the field is "null", "undefined" or an "empty object"', () => {
        expect(isFieldRequired(null)).toBe(false);
        expect(isFieldRequired(undefined)).toBe(false);
    });

    it('should return "false" if the field overview is "NONE"', () => {
        const field = {
            overview: NONE,
        };
        expect(isFieldRequired(field)).toBe(false);
    });

    it('should return "true" if the field overview is not NONE', () => {
        const fieldTitle = {
            overview: RESOURCE_TITLE,
        };
        expect(isFieldRequired(fieldTitle)).toBe(true);

        const fieldDescription = {
            overview: RESOURCE_DESCRIPTION,
        };
        expect(isFieldRequired(fieldDescription)).toBe(true);

        const fieldDetail1 = {
            overview: RESOURCE_DETAIL_1,
        };
        expect(isFieldRequired(fieldDetail1)).toBe(true);

        const fieldDetail2 = {
            overview: RESOURCE_DETAIL_2,
        };
        expect(isFieldRequired(fieldDetail2)).toBe(true);
    });
});
