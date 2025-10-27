const styles = {
    // @ts-expect-error TS7006
    legendColor: (color) => ({
        display: 'block',
        backgroundColor: color,
        height: '1em',
        width: '100%',
    }),
    legend: {
        display: 'flex',
        width: '50%',
        padding: '20px',
    },
    legendItem: {
        flex: 1,
    },
    last: {
        height: '1em',
    },
};

interface ColorScaleLegendProps {
    colorScale(...args: unknown[]): unknown;
    nullColor?: string;
}

const ColorScaleLegend = ({ colorScale, nullColor }: ColorScaleLegendProps) => (
    <div style={styles.legend}>
        {nullColor && (
            <div style={styles.legendItem}>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.legendColor(nullColor)} title={0} />
                <div>{0}</div>
            </div>
        )}
        {/*
         // @ts-expect-error TS7006 */}
        {colorScale.range().map((value) => {
            // @ts-expect-error TS2339
            const [start, end] = colorScale.invertExtent(value);
            return (
                <div key={value} style={styles.legendItem}>
                    <div
                        style={styles.legendColor(value)}
                        title={`${Math.round(start)} to ${Math.round(end)}`}
                    />
                    <div>{Math.round(start)}</div>
                </div>
            );
        })}
        <div style={styles.legendItem}>
            <div style={styles.last} />
            {/*
             // @ts-expect-error TS2339 */}
            <div>{colorScale.domain()[1]}</div>
        </div>
    </div>
);

export default ColorScaleLegend;
