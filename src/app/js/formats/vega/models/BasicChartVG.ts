class BasicChartVG {
    constructor() {
        // @ts-expect-error TS2339
        this.editMode = false;
    }

    // @ts-expect-error TS7006
    setEditMode(bool) {
        // @ts-expect-error TS2339
        this.editMode = bool;
    }

    // eslint-disable-next-line no-unused-vars
    // @ts-expect-error TS7006
    buildSpec(widthIn) {
        throw new Error("The builder can't be use at the state");
    }
}

export default BasicChartVG;
