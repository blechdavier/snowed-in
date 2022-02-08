import Resource from './Resource';
import P5 from 'p5';

class FontResource extends Resource {
    constructor(path: string) {
        super(path);
    }

    loadResource(sketch: P5): void {
        sketch.loadFont(this.path);
    }
}

export = FontResource;
