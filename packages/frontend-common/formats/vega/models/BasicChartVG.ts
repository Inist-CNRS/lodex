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

    buildSpec() {
        throw new Error("The builder can't be use at the state");
    }
}

export default BasicChartVG;
