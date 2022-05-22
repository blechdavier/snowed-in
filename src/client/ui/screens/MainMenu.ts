import { UiScreen } from '../UiScreen';
import p5 from 'p5';
import { UiFrame } from '../UiFrame';
import { Button } from '../Button';
import { OptionsMenu } from './OptionsMenu';
import { FontResource } from '../../assets/resources/FontResource';
import { UiAssets } from '../../assets/Assets';
import { WorldCreationMenu } from './WorldCreationMenu';
import { game } from '../../Game';

export class MainMenu extends UiScreen {

    inputBox: HTMLElement | null

    constructor(font: FontResource, titleFont: FontResource) {
        super();

        this.inputBox = document.getElementById("name");

        if(this.inputBox==null) {
            this.inputBox = document.createElement("input");
            this.inputBox.setAttribute("type", "name");
            this.inputBox.setAttribute("id", "name");
            this.inputBox.setAttribute("placeholder", "Click to Change Username...");
            this.inputBox.oninput = ()=>{
                let v = (document.getElementById("name") as HTMLInputElement).value;
                if(v==undefined) {
                    let inputBox = document.getElementById("name") as HTMLInputElement;
                    inputBox.value = "error_ undefined value"
                    return;
                }
                v = v.substring(0, 20)
                for(let i = 0; i<v.length; i++) {
                    if(!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_ ".includes(v[i])) {
                        //console.log("contains bad bad: "+v[i])
                        v = v.slice(0, i) + v.slice(i+1);
                        i--;
                    }
                }
                let inputBox = document.getElementById("name") as HTMLInputElement;
                inputBox.value = v
            }
            document.body.appendChild(this.inputBox);
        }

        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);

        // make 4 buttons with default positions
        this.buttons = [
            new Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                console.log("join game");
                let v = (document.getElementById("name") as HTMLInputElement).value;
                if(v==undefined)v="ERROR WITH PLAYERNAME"
                while(v[v.length-1]===" ")v = v.substring(0, v.length-2)
                while(v.length<3)v = v+"_"
                game.connection.emit(
                    'join',
                    'e4022d403dcc6d19d6a68ba3abfd0a60',
                    v,
                );
                this.inputBox?.remove()
                game.currentUi = undefined;
            }),
            new Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () =>{
                console.log("options");
                game.currentUi = new OptionsMenu(font, titleFont, "main menu");
            })
        ];

        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }

    render(target: p5, upscaleSize: number): void {

        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);

        UiAssets.title_image.render(target, Math.round(this.frame.x/upscaleSize+1)*upscaleSize, Math.round(this.frame.y/upscaleSize+4)*upscaleSize, 256*upscaleSize, 40*upscaleSize);

        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }

    }

    windowUpdate() {

        if(this.inputBox !== null) {
            this.inputBox.style.top = ((game.height/2)+"px")
            this.inputBox.style.left = ((game.width/2-192/2*game.upscaleSize)+"px")
            this.inputBox.style.width = ((192*game.upscaleSize-10)+"px")
            this.inputBox.style.height =((16*game.upscaleSize-10)+"px")
            this.inputBox.style.fontSize =((10*game.upscaleSize)+"px")
            this.inputBox.style.borderRadius = ((6*game.upscaleSize)+"px")
            this.inputBox.style.borderWidth = ((1*game.upscaleSize)+"px")
        }

        // set the position of the frame
        this.frame.x = game.width/2-264/2*game.upscaleSize;// center the frame in the middle of the screen
        this.frame.y = game.height/2-56*game.upscaleSize;
        this.frame.w = 264*game.upscaleSize;
        this.frame.h = 48*game.upscaleSize;

        // set the positions of all the buttons
        for(let i = 0; i<this.buttons.length; i++) {
            this.buttons[i].x = game.width/2-192/2*game.upscaleSize;
            this.buttons[i].y = game.height/2+20*(i+1)*game.upscaleSize;
            this.buttons[i].w = 192*game.upscaleSize;
            this.buttons[i].h = 16*game.upscaleSize;
            this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
        }

    }

}