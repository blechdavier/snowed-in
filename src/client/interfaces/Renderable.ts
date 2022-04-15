import P5 from 'p5';

export interface Renderable {
    render(target: P5, upscaleSize: number): void
}