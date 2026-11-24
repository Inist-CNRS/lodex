import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
};

// when each rocket bursts, in ms
const BURST_DELAYS = [0, 350, 800, 1300, 1800, 2400];
const PARTICLES_PER_BURST = 60;
// how many frames of its move a particle leaves behind it
const TRAIL_LENGTH = 4;

// rockets bursting over the whole screen, in the colors of the theme.
// Nothing for who asked for less motion.
export const Fireworks = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const { palette } = useTheme();
    useEffect(() => {
        const canvas = ref.current;
        if (
            !canvas ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // no white: the popup is white
        const colors = [
            palette.primary.main,
            palette.secondary.main,
            palette.info.main,
        ];
        let particles: Particle[] = [];
        let frame = 0;
        let burstCount = 0;

        const burst = () => {
            const x = canvas.width * (0.1 + Math.random() * 0.8);
            const y = canvas.height * (0.1 + Math.random() * 0.5);
            // each color in turn: they all show
            const color = colors[burstCount++ % colors.length];
            for (let i = 0; i < PARTICLES_PER_BURST; i++) {
                const angle = (Math.PI * 2 * i) / PARTICLES_PER_BURST;
                const speed = 2 + Math.random() * 8;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color,
                });
            }
        };

        const tick = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(({ life }) => life > 0);
            context.lineCap = 'round';
            context.lineWidth = 4;
            for (const particle of particles) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                // they fall and slow down
                particle.vy += 0.06;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.life -= 0.009;
                context.globalAlpha = Math.max(particle.life, 0);
                context.strokeStyle = particle.color;
                // a streak, not a dot: it shows on the page and on the popup
                context.beginPath();
                context.moveTo(
                    particle.x - particle.vx * TRAIL_LENGTH,
                    particle.y - particle.vy * TRAIL_LENGTH,
                );
                context.lineTo(particle.x, particle.y);
                context.stroke();
            }
            frame = particles.length ? requestAnimationFrame(tick) : 0;
        };

        const timers = BURST_DELAYS.map((delay) =>
            setTimeout(() => {
                burst();
                frame ||= requestAnimationFrame(tick);
            }, delay),
        );
        return () => {
            timers.forEach(clearTimeout);
            cancelAnimationFrame(frame);
        };
    }, [palette]);

    return (
        <Box
            component="canvas"
            ref={ref}
            aria-hidden
            sx={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};
