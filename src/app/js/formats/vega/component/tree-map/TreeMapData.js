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
     * Formatted list of nodes and leaves ready to be cleanup and returned
     * @type {Map<number, {id: number, name: string, parent: number?, size: number?}>}
     */
    formattedNodesAndLeaves;
    /**
     * Filtered nodes use to create the final transformed data
     * @type {Set<number>}
     */
    filteredNodes;

    constructor(data) {
        this.data = data;
        this.idIncrement = 0;
        this.ids = new Map();
        this.rawNodesAndLeaves = new Map();
        this.formattedNodesAndLeaves = new Map();
        this.filteredNodes = new Set();
    }

    /**
     * Create an id to the given node if none have been created previously and return the corresponding id
     * @param node
     * @return {number | undefined}
     */
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
    createHierarchy(node) {
        const maxRecursion = 10;
        let recursion = 0;

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
     * Transformed routine data into transformable data
     */
    buildNodesAndLeaves() {
        for (let datum of this.data) {
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
     * Create a list of node and transformed the raw data into cleanable data
     */
    buildFilteredNodes() {
        for (let rawNodeAndLeaf of this.rawNodesAndLeaves) {
            const node = rawNodeAndLeaf[0];
            const datum = rawNodeAndLeaf[1];
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

        for (let formattedNodeAndLeaf of this.formattedNodesAndLeaves) {
            const node = formattedNodeAndLeaf[0];
            const datum = formattedNodeAndLeaf[1];

            if (this.filteredNodes.has(node)) {
                delete datum.size;
                transformedAndCleanupData.push(datum);
                continue;
            }

            datum.hierarchy = this.createHierarchy(datum.parent);

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
