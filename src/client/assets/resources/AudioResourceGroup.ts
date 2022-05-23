import { AudioResource } from './AudioResource';
import P5 from "p5";
import { Resource } from './Resource';

export class AudioResourceGroup extends Resource {

    sounds: AudioResource[]

    constructor(sounds: AudioResource[]) {// pass in an array of AudioResources that are all similar
        super("AUDIORESOURCEGROUP DOES NOT HAVE PATH");
        this.sounds = sounds;
    }

    loadResource(sketch: P5): void {
        for(let audioResource of this.sounds) {
            audioResource.loadResource(sketch);
        }
    }

    playRandom(stereo: number, volume?: number) {// play a random sound
        if(this.sounds === undefined || this.sounds.length === 0)
            throw new Error(
                `There are no sounds: ${this.sounds}`
            );
        console.log("tried to play audioresourcegroup")
        if(volume===undefined) volume = 1;
        const r = Math.floor(Math.random() * this.sounds.length);
        this.sounds[r].playRandom(stereo, volume);// play a random sound from the array at a slightly randomized pitch, leading to the effect of it making a new sound each time, removing repetitiveness

    }

}