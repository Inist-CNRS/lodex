/**
 * Class use for create radar chart spec
 */
class FlowMap {
    /**
     * Init all required parameters
     */
    constructor() {
        this.model = require('./json/flow_map.vg.json');
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    buildSpec(widthIn, p) {
        this.model.width = widthIn - widthIn * 0.06;
        this.model.height = widthIn - widthIn * 0.24;

        this.model.marks.forEach(e => {
            if (e.type === 'text') {
                e.encode.encode.x.value = this.model.width - 5;
            }
        });

        this.model.signals.forEach(e => {
            if (e.name === 'scale') {
                e.bind.name = p.t('flow_map_scale');
            }
            if (e.name === 'translateX') {
                e.bind.name = p.t('flow_map_translateX');
            }
            if (e.name === 'translateY') {
                e.bind.name = p.t('flow_map_translateY');
            }
        });

        return this.model;
    }
}

export default FlowMap;
