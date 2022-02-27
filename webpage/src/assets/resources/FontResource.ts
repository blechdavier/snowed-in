import Resource from './Resource';
import ImageResource from './ImageResource';
import p5 from 'p5';
import game from '../../Main'

class FontResource extends ImageResource {

    characterData: {[letter: string]: number}
    alphabet_soup: {[letter: string]: {x: number, y: number, w: number, h: number}} = {}

    constructor(path: string, characterData: {[letter: string]: number}) {
        super(path);
        this.characterData = characterData;
        let runningTotal = 0
        Object.entries(this.characterData).forEach((item: [string, number]) => {
            this.alphabet_soup[item[0]] = {x: runningTotal, y: 0, w: item[1], h: 12}
            runningTotal += item[1] + 1
        });
    }

    drawText(target: p5, str: string, x: number, y: number) {
        let xOffset: number = 0;
        for(let i = 0; i<str.length; i++) {
            this.renderPartial(x+xOffset*game.upscaleSize, y, this.alphabet_soup[str[i]].w*game.upscaleSize, this.alphabet_soup[str[i]].h*game.upscaleSize, this.alphabet_soup[str[i]].x, this.alphabet_soup[str[i]].y, this.alphabet_soup[str[i]].w, this.alphabet_soup[str[i]].h);
            xOffset += this.alphabet_soup[str[i]].w+1;
        }
    }
}
export = FontResource;
