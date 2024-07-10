import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { sizeConverter } from './rootAdminUtils';
import { Tooltip } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import SdStorageIcon from '@mui/icons-material/SdStorage';

const greenColor = {
    red: 19,
    green: 233,
    blue: 19,
};
const yellowColor = {
    red: 255,
    green: 255,
    blue: 0,
};
const redColor = {
    red: 255,
    green: 0,
    blue: 0,
};

// https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript
// https://gist.github.com/gskema/2f56dc2e087894ffc756c11e6de1b5ed
const colorGradient = (fadeFraction, rgbColor1, rgbColor2, rgbColor3) => {
    let color1 = rgbColor1;
    let color2 = rgbColor2;
    let fade = fadeFraction;

    // Do we have 3 colours for the gradient? Need to adjust the params.
    if (rgbColor3) {
        fade = fade * 2;

        // Find which interval to use and adjust the fade percentage
        if (fade >= 1) {
            fade -= 1;
            color1 = rgbColor2;
            color2 = rgbColor3;
        }
    }

    const diffRed = color2.red - color1.red;
    const diffGreen = color2.green - color1.green;
    const diffBlue = color2.blue - color1.blue;

    const red = Math.floor(color1.red + diffRed * fade);
    const green = Math.floor(color1.green + diffGreen * fade);
    const blue = Math.floor(color1.blue + diffBlue * fade);

    return `rgb(${red},${green},${blue})`;
};

const CircularProgressWithLabel = ({ value, title }) => {
    return (
        <Tooltip title={title}>
            <Box
                sx={{
                    marginTop: '8px',
                    position: 'relative',
                    display: 'inline-flex',
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                        sx={{
                            transform: 'rotate(0.395turn) !important',
                            color: '#e3e3e3',
                        }}
                        variant="determinate"
                        value={70}
                    />
                    <CircularProgress
                        sx={{
                            transform: 'rotate(0.395turn) !important',
                            position: 'absolute',
                            left: 0,
                            color: colorGradient(
                                value / 100,
                                greenColor,
                                yellowColor,
                                redColor,
                            ),
                        }}
                        variant="determinate"
                        color="secondary"
                        value={(value * 70) / 100}
                    />
                </Box>

                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        color="inherit"
                    >
                        {`${Math.round(value)}%`}
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    );
};

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

const SystemLoad = () => {
    const [loadTitle, setLoadTitle] = useState('');
    const [loadAvg, setLoadAvg] = useState(0);

    const [memTitle, setMemTile] = useState('');
    const [memUsage, setMemUsage] = useState(0);

    const [storageTitle, setStorageTile] = useState('');
    const [storageUsage, setStorageUsage] = useState(0);

    const fetchSystemLoad = () => {
        fetch('/rootAdmin/system', {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setLoadTitle(
                    `${data.loadavg[0]}% / 1 min, ${data.loadavg[1]}% / 5 min, ${data.loadavg[2]}% / 15 min`,
                );
                setLoadAvg(data.loadavg[0]);

                const memPercent =
                    ((data.totalmem - data.freemem) / data.totalmem) * 100;
                const totalMen = sizeConverter(data.totalmem / 1024);
                const useMem = sizeConverter(
                    (data.totalmem - data.freemem) / 1024,
                );

                setMemUsage(memPercent);
                setMemTile(`${useMem} / ${totalMen}`);

                const storagePercent =
                    (data.database.use / data.database.total) * 100;
                const totalStorage = sizeConverter(data.database.total);
                const useStorage = sizeConverter(data.database.use);

                setStorageUsage(storagePercent);
                setStorageTile(`${useStorage} / ${totalStorage}`);
            });
    };

    // Fetch on loads
    useEffect(() => {
        fetchSystemLoad();
    }, []);

    // Fetch evey 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            fetchSystemLoad();
        }, 5000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <div
                style={{
                    position: 'relative',
                }}
            >
                <MemoryIcon
                    sx={{
                        fontSize: '18px',
                        position: 'absolute',
                        zIndex: '10',
                        bottom: '2px',
                        left: '11px',
                    }}
                />
                <CircularProgressWithLabel title={loadTitle} value={loadAvg} />
            </div>
            <div
                style={{
                    marginLeft: '8px',
                    position: 'relative',
                }}
            >
                <StorageIcon
                    sx={{
                        fontSize: '18px',
                        position: 'absolute',
                        zIndex: '10',
                        bottom: '2px',
                        left: '11px',
                    }}
                />
                <CircularProgressWithLabel title={memTitle} value={memUsage} />
            </div>
            <div
                style={{
                    marginLeft: '8px',
                    marginRight: '16px',
                    position: 'relative',
                }}
            >
                <SdStorageIcon
                    sx={{
                        fontSize: '18px',
                        position: 'absolute',
                        zIndex: '10',
                        bottom: '2px',
                        left: '11px',
                    }}
                />
                <CircularProgressWithLabel
                    title={storageTitle}
                    value={storageUsage}
                />
            </div>
        </>
    );
};

export default SystemLoad;
