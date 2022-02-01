import P5 from 'p5';

abstract class Resource {
    path: string;

    protected constructor(path: string) {
        this.path = path;
    }

    abstract loadResource(sketch: P5): void;
}

export = Resource;
