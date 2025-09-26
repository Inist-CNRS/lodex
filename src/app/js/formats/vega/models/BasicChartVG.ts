class BasicChartVG {
    constructor() {
        this.editMode = false;
    }

    setEditMode(bool) {
        this.editMode = bool;
    }

    // eslint-disable-next-line no-unused-vars
    buildSpec(widthIn) {
        throw new Error("The builder can't be use at the state");
    }
}

export default BasicChartVG;
