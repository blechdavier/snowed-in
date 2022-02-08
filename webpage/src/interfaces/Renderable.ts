import P5 from 'p5';

interface Renderable {
    render(target: P5, upscaleSize: number): void
}

export = Renderable