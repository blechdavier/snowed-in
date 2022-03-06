import P5 from 'p5';
import Resource from './Resource';
require('p5/lib/addons/p5.sound');


class AudioResource extends Resource {
    sound: P5.SoundFile

    constructor(path: string) {
        super(path);
    }

    loadResource(game: P5) {
        //const loadSound = (path: string) =>
            //((game as any) as P5.SoundFile).loadSound(path);
        //this.sound = loadSound("../audio/demo.mp3")
    }

    playRandom() {
        // Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );

        //this.sound.rate(random(0.9, 1 / 0.9));
        //this.sound.play();
    }

    play() {// play the sound
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );
        //this.sound.play();
    }

}

export = AudioResource;
