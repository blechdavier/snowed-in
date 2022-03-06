import p5 from 'p5';
import Resource from './Resource';

class AudioResource extends Resource {
    // sound: sound file type;

    constructor(path: string) {
        super(path);
    }

    loadResource() {
        console.log("asdf");
        // this.sound = loadSound(this.path);
    }

    playRandom() {
        // Verify that the sound has been loaded
        // if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );

        // this.sound.rate(random(0.9, 1/0.9));
        // this.sound.play();
    }

    play() {// play the sound
        // this.sound.play();
    }

}

export = AudioResource;
