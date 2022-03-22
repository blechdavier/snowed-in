import P5 from 'p5';
import Resource from './Resource';
import { AudioType } from 'ts-audio';
import Audio from 'ts-audio';


class AudioResource extends Resource {
    sound: AudioType

    constructor(path: string) {
        super(path);
    }

    loadResource(game: P5) {
        this.sound = Audio({
            file: this.path,
            loop: false,
            volume: 1.0,
        });
    }

    // playRandom() {
    //     // Verify that the sound has been loaded
    //     if (this.sound === undefined)
    //         throw new Error(
    //             `Tried to play sound before loading it: ${this.path}`
    //         );

    //     this.sound.play();
    // }

    play() {// play the sound
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );
        this.sound.stop();
        this.sound.play();
    }

}

export = AudioResource;
