import UiScreen from '../UiScreen';
import Game from '../../Game';
import p5 from 'p5';
import Button from '../Button';

class ScreenMenu extends UiScreen {

    buttonList: Button[] = []

    constructor() {
        super();
        this.buttonList.push(new Button(250, 250, 150, 75))
        this.buttonList.push(new Button(250, 350, 150, 75))
    }

    buttonPressed(): void {
    }

    render(target: p5, upscaleSize: number): void {
        this.buttonList.forEach(button => {
            button.render(target, upscaleSize);
        })
    }

    tick(game: Game): void {
    }

}

export = ScreenMenu