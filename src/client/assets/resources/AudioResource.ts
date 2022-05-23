import P5 from 'p5';
import { Resource } from './Resource';
import { Howler, Howl } from 'howler'

export class AudioResource extends Resource {
    sound: Howl

    constructor(path: string) {
        super(path);
    }

    loadResource(game: P5) {
        this.sound = new Howl({
            src: [this.path]
          });
    }

    playRandom(stereo: number, volume?: number) {
        // Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );
        console.log("tried to play random")
        if(volume===undefined) volume = 1;
        this.sound.volume(volume);
        this.sound.stereo(stereo);
        this.sound.rate(Math.random()*0.4+0.8);
        this.sound.play();
    }

    playSound(stereo: number) {// play the sound
        //Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(
                `Tried to play sound before loading it: ${this.path}`
            );
        this.sound.rate(1)
        this.sound.stereo(stereo)
        this.sound.play();
    }

}
