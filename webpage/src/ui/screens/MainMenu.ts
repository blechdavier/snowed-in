import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';
import { isFunctionExpression } from 'typescript';

export class MainMenu extends UiScreen {

    frame: UiFrame;
    buttons: Button[];

    constructor() {
        super();
        this.frame = new UiFrame(0, 0, 0, 0);
        this.buttons = [
            new Button("Resume Game", "Keep playing where you left off.", 0, 0, 0, 0),
            new Button("New Game", "Creates a new server that your friends can join.", 0, 0, 0, 0),
            new Button("Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0),
            new Button("Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0)
        ];
        this.windowUpdate();
    }

    buttonPressed(): void {
    }

    render(target: p5, upscaleSize: number): void {

        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);

        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }
    }

    windowUpdate() {
        // set the position of the rectangular image that the whole menu is on
        this.frame.x = game.width/2-256/2*game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height/2-192/2*game.upscaleSize;
        this.frame.w = 256*game.upscaleSize;
        this.frame.h = 192*game.upscaleSize;

        // set the position of the resume game game button
        this.buttons[0].x = game.width/2-192/2*game.upscaleSize;
        this.buttons[0].y = game.height/2;
        this.buttons[0].w = 192*game.upscaleSize;
        this.buttons[0].h = 16*game.upscaleSize;

        // set the position of the new game button
        this.buttons[1].x = game.width/2-192/2*game.upscaleSize;
        this.buttons[1].y = game.height/2+20*game.upscaleSize;
        this.buttons[1].w = 192*game.upscaleSize;
        this.buttons[1].h = 16*game.upscaleSize;

        // set the position of the join game button
        this.buttons[2].x = game.width/2-192/2*game.upscaleSize;
        this.buttons[2].y = game.height/2+40*game.upscaleSize;
        this.buttons[2].w = 192*game.upscaleSize;
        this.buttons[2].h = 16*game.upscaleSize;

        // set the position of the options button
        this.buttons[3].x = game.width/2-192/2*game.upscaleSize;
        this.buttons[3].y = game.height/2+60*game.upscaleSize;
        this.buttons[3].w = 192*game.upscaleSize;
        this.buttons[3].h = 16*game.upscaleSize;
    }

}