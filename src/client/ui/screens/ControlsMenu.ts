import { UiScreen } from '../UiScreen';
import p5 from 'p5';
import { UiFrame } from '../UiFrame';
import { game } from '../../Game';
import { Button } from '../Button';
import { FontResource } from '../../assets/resources/FontResource';
import { OptionsMenu } from './OptionsMenu';
import { InputBox } from '../InputBox';
import { Control } from '../../input/Control'

export class ControlsMenu extends UiScreen {

	constructor(font: FontResource, titleFont: FontResource) {
		super();
		// make the frame with some default values.  These will later be changed to fit the screen size.
		this.frame = new UiFrame(0, 0, 0, 0);

		// make some buttons with default positions
		this.buttons = [
			new Button(font, "Back", "Return to the options menu.", 0, 0, 0, 0, () => {
				console.log("options menu");
				game.currentUi = new OptionsMenu(font, titleFont);
			})
		];

		this.inputBoxes = [
			// new InputBox(font, "Walk Right", true, 68, 0, 0, 0, 0, 0),
			// new InputBox(font, "Walk Left", true, 65, 1, 0, 0, 0, 0),
			// new InputBox(font, "Jump", true, 32, 2, 0, 0, 0, 0),
			// new InputBox(font, "Pause", true, 27, 3, 0, 0, 0, 0)
		]

		let i = 0;
		for (let control of game.controls) {
			i++;
			this.inputBoxes.push(new InputBox(font, control.description, control.keyboard, control.keyCode, i, 0, 0, 0, 0));
		}
		// update the size of the elements based on the initial screen size
		this.windowUpdate();
	}

	render(target: p5, upscaleSize: number): void {

		// render the rectangular image
		this.frame.render(target, upscaleSize);

		// loop through the buttons array and render each one.
		this.buttons.forEach(button => {
			button.render(target, upscaleSize);
		});

		// loop through the inputBoxes array and render each one.
		this.inputBoxes.forEach(inputBox => {
			inputBox.render(target, upscaleSize);
		});
	}

	windowUpdate() {
		// set the position of the frame
		this.frame.x = game.width / 2 - 200 / 2 * game.upscaleSize;// center the frame in the center of the screen
		this.frame.y = game.height / 2 - 56 * game.upscaleSize;
		this.frame.w = 200 * game.upscaleSize;
		this.frame.h = 48 * game.upscaleSize;
	}
}