import { UiScreen } from '../UiScreen';
import p5 from 'p5';
import { UiFrame } from '../UiFrame';
import { game } from '../../Game';
import { Button } from '../Button';
import { FontResource } from '../../assets/resources/FontResource';
import { OptionsMenu } from './OptionsMenu';

export class VideoSettingsMenu extends UiScreen {

	constructor(font: FontResource, titleFont: FontResource, previousMenu: string) {
		super();
		// make the frame with some default values.  These will later be changed to fit the screen size.
		this.frame = new UiFrame(0, 0, 0, 0);


		if(game.skyMod === undefined)
			game.skyMod = 2;

		if(game.skyToggle === undefined)
			game.skyToggle = true;

		if(game.particleMultiplier === undefined)
			game.particleMultiplier = 1;

		let tempSkyModeText;

		if(game.skyMod===2) {
			tempSkyModeText = "Half Framerate";
		}
		else if(game.skyMod===1) {
			tempSkyModeText = "Full Framerate";
		}
		else {
			tempSkyModeText = "Solid Color";
		}

		let tempParticleText;

		if(game.particleMultiplier===2) {
			tempParticleText = "Double";
		}
		else if(game.particleMultiplier===1) {
			tempParticleText = "Normal";
		}
		else {
			tempParticleText = "Minimal";
		}


		// make some buttons with default positions
		this.buttons = [
			new Button(font, `Sky: ${tempSkyModeText}`, "Change the appearance of the sky.", 0, 0, 0, 0, () => {
				console.log("sky toggle");
				if(this.buttons[0].txt === "Sky: Half Framerate"){
					this.buttons[0].txt = "Sky: Full Framerate";
					game.skyMod = 1;
					game.skyToggle = true;
				}
				else if(this.buttons[0].txt === "Sky: Full Framerate") {
					this.buttons[0].txt = "Sky: Solid Color";
					game.skyToggle = false;
				}
				else {
					this.buttons[0].txt = "Sky: Half Framerate";
					game.skyMod = 2;
					game.skyToggle = true;
				}
			}),
			new Button(font, `Particles: ${tempParticleText}`, "Change the amount of particles", 0, 0, 0, 0, () => {
				console.log("particles");
				if(this.buttons[1].txt === "Particles: Normal"){
					this.buttons[1].txt = "Particles: Double";
					game.particleMultiplier = 2;
				}
				else if(this.buttons[1].txt === "Particles: Double") {
					this.buttons[1].txt = "Particles: Minimal";
					game.particleMultiplier = 0.5;
				}
				else {
					this.buttons[1].txt = "Particles: Normal";
					game.particleMultiplier = 1;
				}
			}),
			new Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
				console.log("main menu");
				game.currentUi = new OptionsMenu(font, titleFont, previousMenu);
			})
		];
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
	}

	windowUpdate() {
		// set the position of the frame
		this.frame.x = game.width / 2 - 200 / 2 * game.upscaleSize;// center the frame in the center of the screen
		this.frame.y = game.height / 2 - 56 * game.upscaleSize;
		this.frame.w = 200 * game.upscaleSize;
		this.frame.h = 48 * game.upscaleSize;

		// set the positions of all the buttons
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].x = game.width / 2 - 192 / 2 * game.upscaleSize;
			this.buttons[i].y = game.height / 2 + 20 * i * game.upscaleSize;
			this.buttons[i].w = 192 * game.upscaleSize;
			this.buttons[i].h = 16 * game.upscaleSize;
			this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
		}
	}

}