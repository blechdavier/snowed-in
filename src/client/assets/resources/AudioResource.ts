import P5 from 'p5';
import { Resource } from './Resource';
import Audio, { AudioType } from 'ts-audio';

export class AudioResource extends Resource {
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

    playSound() {// play the sound
        //Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );
        this.sound.pause();
        this.sound.play();
    }

}
