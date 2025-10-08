import generateUid from './generateUid';

describe('generateUid', () => {
    it('should generate random 4 char uid', async () => {
        const uid = await generateUid();
        expect(uid).toMatch(/^[A-za-z0-9+/]{4}$/);
    });

    it('should generate different uid on eac call', async () => {
        const uid1 = await generateUid();
        const uid2 = await generateUid();
        expect(uid1).not.toEqual(uid2);
    });
});
