import { AudioResource } from './AudioResource';
import P5 from "p5";

export class AudioResourceGroup {

    sounds: AudioResource[]

    constructor(sounds: AudioResource[]) {// pass in an array of AudioResources that are all similar
        this.sounds = sounds;
    }

    playRandom() {// play a random sound
        if(this.sounds === undefined || this.sounds.length === 0)
            throw new Error(
                `There are no sounds: ${this.sounds}`
            );
        const r = Math.floor(Math.random() * this.sounds.length);
        this.sounds[r].playSound();// play a random sound from the array at a slightly randomized pitch, leading to the effect of it making a new sound each time, removing repetitiveness

    }

}