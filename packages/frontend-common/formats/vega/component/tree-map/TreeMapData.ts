export default class TreeMapData {
    /**
     * Raw data to be filtered and transformed
     * @type {Array<{source:string, target: string, weight: number}>}
     */
    data;
    /**
     * Nodes and leaves ids counter
     * @type {number}
     */
    idIncrement;
    /**
     * List of nodes and leaves ids
     * @type {Map<string, number>}
     */
    ids;
    /**
     * Raw list of nodes and leaves ready to be filtered and transformed
     * @type {Map<string, {parent: number?, size: number?}>}
     */
    rawNodesAndLeaves;
    /**
     * Formatted list of nodes and leaves ready to be clean-up and returned
     * @type {Map<number, {id: number, name: string, parent: number?, size: number?}>}
     */
    formattedNodesAndLeaves;
    /**
     * Filtered nodes (list of nodes without the leaves) use to create the final transformed data
     * @type {Set<number>}
     */
    filteredNodes;

    /**
     * Those variables are use when we have flat data
     * @type {boolean}
     */
    isHierarchy;
    /**
     * @type {Map<string, any>}
     */
    originalObject;

    /**
     * @param {Array<{source: string, target: string, weight: string | number, original?: any}>} data
     * @param isHierarchy
     */
    // @ts-expect-error TS7006
    constructor(data, isHierarchy = true) {
        this.data = data;
        this.idIncrement = 0;
        this.ids = new Map();
        this.rawNodesAndLeaves = new Map();
        this.formattedNodesAndLeaves = new Map();
        this.filteredNodes = new Set();
        this.isHierarchy = isHierarchy;

        if (!this.isHierarchy) {
            this.originalObject = new Map();
            // @ts-expect-error TS7006
            data.forEach((datum) => {
                if (datum.original) {
                    // @ts-expect-error TS2532
                    this.originalObject.set(datum.target, datum.original);
                }
            });
        }
    }

    /**
     * Create an id to the given node if none have been created previously and return the corresponding id
     * @param node
     * @return {number | undefined}
     */
    // @ts-expect-error TS7006
    createIdIfNotExist(node) {
        if (!this.ids.has(node)) {
            const id = ++this.idIncrement;
            this.ids.set(node, id);
            return id;
        }
        return this.ids.get(node);
    }

    /**
     * Get the hierarchy of a leaf from it first parent
     * @param node First parent of the leaf
     * @return {string} Leaf parent list
     */
    // @ts-expect-error TS7006
    createHierarchy(node) {
        const maxRecursion = 10;
        let recursion = 0;

        // @ts-expect-error TS7023
        const getHierarchy = (parentId) => {
            recursion++;
            if (recursion > maxRecursion) {
                return [];
            }

            if (!this.formattedNodesAndLeaves.has(parentId)) {
                return [];
            }

            const parent = this.formattedNodesAndLeaves.get(parentId);
            if (parent.parent) {
                return [...getHierarchy(parent.parent), parent.name];
            }

            return [parent.name];
        };

        return getHierarchy(node).join(', ');
    }

    /**
     * Transforme routine data into manipulable data
     */
    buildNodesAndLeaves() {
        for (const datum of this.data) {
            const parentNode = datum.source;
            const node = datum.target;
            const size = datum.weight;
            const parentNodeId = this.createIdIfNotExist(parentNode);
            this.createIdIfNotExist(node);

            if (!this.rawNodesAndLeaves.has(parentNode)) {
                this.rawNodesAndLeaves.set(parentNode, {});
            }

            this.rawNodesAndLeaves.set(node, {
                parent: parentNodeId,
                size,
            });
        }
    }

    /**
     * Create a list of node and transforme the raw data into cleanable data
     */
    buildFilteredNodes() {
        for (const [node, datum] of this.rawNodesAndLeaves) {
            const id = this.ids.get(node);

            if (datum.parent) {
                this.filteredNodes.add(datum.parent);
            }

            this.formattedNodesAndLeaves.set(id, {
                id,
                name: node,
                ...datum,
            });
        }
    }

    /**
     * Create the cleanup the transformed data by remove size of node and adding the hierarchy on leaf
     * @return {Array<{id: number, name: string, hierarchy?: string, parent?: number, size?: number}>}
     */
    buildReturnable() {
        /**
         * @type {Array<{id: number, name: string, hierarchy: string?, parent: number?, size: number?}>}
         */
        const transformedAndCleanupData = [];

        for (const [node, datum] of this.formattedNodesAndLeaves) {
            if (this.filteredNodes.has(node)) {
                delete datum.size;
                transformedAndCleanupData.push(datum);
                continue;
            }

            if (this.isHierarchy) {
                datum.hierarchy = this.createHierarchy(datum.parent);
            } else {
                // @ts-expect-error TS2532
                datum.original = this.originalObject.get(datum.name);
            }

            transformedAndCleanupData.push(datum);
        }

        return transformedAndCleanupData;
    }

    /**
     * Start the filtering and transformation process and return the result of it
     * @return {Array<{id: number, name: string, hierarchy?: string, parent?: number, size?: number}>}
     */
    build() {
        this.buildNodesAndLeaves();
        this.buildFilteredNodes();
        return this.buildReturnable();
    }
}

/**
 * @param {Array<{_id: string, value: string | number}>} values
 * @return {Array<{source: string, target: string, weight: string | number, original: any}>}
 */
// @ts-expect-error TS2339
TreeMapData.transformIdValue = (values) => {
    // @ts-expect-error TS7034
    const finalValues = [];
    // @ts-expect-error TS7006
    values.forEach((datum) => {
        const middleNode = `root_${datum._id}`;
        finalValues.push({
            source: middleNode,
            target: datum._id,
            weight: datum.value,
            original: { ...datum },
        });
        finalValues.push({
            source: 'root',
            target: middleNode,
            weight: datum.value,
        });
    });
    // @ts-expect-error TS7005
    return finalValues;
};

/**
 * @param {Array<{source: string, target: string, weight: string | number}>} values
 * @return {Array<{source: string, target: string, weight: string | number, original: any}>}
 */
// @ts-expect-error TS2339
TreeMapData.transformSourceTargetWeight = (values) => {
    // @ts-expect-error TS7034
    const finalValues = [];
    // @ts-expect-error TS7006
    values.forEach((datum) => {
        const leaves = `leaves_${datum.source}_${datum.target}`;
        finalValues.push({
            source: datum.source,
            target: leaves,
            weight: datum.weight,
            original: { ...datum },
        });
        finalValues.push({
            source: 'root',
            target: datum.source,
            weight: datum.weight,
        });
    });
    // @ts-expect-error TS7005
    return finalValues;
};
