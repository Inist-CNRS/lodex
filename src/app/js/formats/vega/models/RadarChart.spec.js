import RadarChart from './RadarChart';

describe('BasicChart', () => {
    it('test', function() {
        const radarChart = new RadarChart();
        console.log(JSON.stringify(radarChart.buildSpec(400)));
    });
});
