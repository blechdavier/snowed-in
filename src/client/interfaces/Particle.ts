import P5 from 'p5';

interface Particle {
    age: number;
    lifespan: number;
    x: number;
    y: number;
    xVel: number;
    yVel: number;
    render(target: P5, upscaleSize: number): void,
    tick(): void;
}

export = Particle