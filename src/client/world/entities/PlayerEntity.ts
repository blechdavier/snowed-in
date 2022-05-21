import p5 from 'p5';
import { ServerEntity } from './ServerEntity';
import { Entities, EntityPayload } from '../../../global/Entity';
import { game } from '../../Game';
import { AnimationFrame, PlayerAnimations } from '../../assets/Assets';
import { ReflectableImageResource } from '../../assets/resources/ReflectedImageResource';

export class PlayerEntity extends ServerEntity {
    width: number = 12 / game.TILE_WIDTH;
    height: number = 28 / game.TILE_HEIGHT;
    name: string;
    idNumber: number;
    color1: [number, number, number, number]
    color2: [number, number, number, number]
    currentAnimation: AnimationFrame<typeof PlayerAnimations> = "idle"
    timeInThisAnimationFrame: number = 0;
    animFrame: number = 0;

    
    animations: {
        [key: string]: [ReflectableImageResource, number][],
    } = {};

    constructor(data: EntityPayload) {
        super(data.id);
        if (data.type === Entities.Player) {
            this.name = data.data.name;
        }
        data.id = data.id.split("-").join("");//string.prototype.replaceAll requires ES2021
        this.idNumber = (Number("0x"+data.id)/100000000000000000000000000000)%1;//get a number 0-1 pseudorandomly selected from the uuid of the player
        console.log(this.idNumber);
        this.color1 = hslToRgb(this.idNumber, 1, 0.45);//convert this to two HSL colors which are then converted to two RGB colors: one light and one dark
        this.color2 = hslToRgb(this.idNumber, 1, 0.3);
        console.log(`creating animations for player with colors ${this.color1} and ${this.color2}`)
        //console.log("TEST: "+(this.animations.idle[0][0].image===PlayerAnimations.idle[0][0].image))
        // let img = this.animations.idle[0][0].image;
        // img.loadPixels();
        // img.set(3, 10, [0, 255, 0, 255]);
        // img.updatePixels();
        Object.entries(PlayerAnimations).forEach(element => {
            this.animations[element[0]] = [];
            for(let frame of element[1]) {
                this.animations[element[0]].push([new ReflectableImageResource(frame[0].path, this.color1, this.color2), frame[1]]);
                let reflectableResource = this.animations[element[0]][this.animations[element[0]].length-1][0];
                reflectableResource.loadResource(game);
            }
        });
    }

    updateData(data: EntityPayload): void {
        if (data.type === Entities.Player) {
            this.name = data.data.name;
        }
    }

    render(target: p5, upscaleSize: number): void {

        //update animation frame based on deltaTime
        this.timeInThisAnimationFrame += game.deltaTime;
        console.log(this.animFrame);
        // console.log([this.currentAnimation, this.animFrame]);
        // console.log(PlayerAnimations[this.currentAnimation])
        // console.log(PlayerAnimations[this.currentAnimation][this.animFrame])
        if(this.timeInThisAnimationFrame>PlayerAnimations[this.currentAnimation][this.animFrame][1]) {
            this.timeInThisAnimationFrame = 0;//this does introduce some slight inaccuracies vs subtracting it, but, when you tab back into the browser after being tabbed out, subtracting it causes spazzing
            this.animFrame++;
            if(this.animFrame>=PlayerAnimations[this.currentAnimation].length) {
                this.animFrame = this.animFrame%PlayerAnimations[this.currentAnimation].length;
            }
        }

        //PlayerA
        // Render the item quantity label
        this.animations[this.currentAnimation][this.animFrame][0].render(
            target,
            (this.x * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH) *
                upscaleSize,
            (this.y * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT) *
                upscaleSize,
            this.width * upscaleSize * game.TILE_WIDTH,
            this.height * upscaleSize * game.TILE_HEIGHT
        );
        this.animations[this.currentAnimation][this.animFrame][0].renderWorldspaceReflection(
            this.x,
            this.y+this.height,
            this.width,
            this.height
        );

        target.noStroke();

        target.textSize(5 * upscaleSize);
        target.textAlign(target.CENTER, target.TOP);

        target.text(
            this.name+", test: "+this.animations.idle[0][0].image.get(3, 10),
            (this.x * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH +
                (this.width * game.TILE_WIDTH) / 2) *
                upscaleSize,
            (this.y * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT -
                (this.height * game.TILE_WIDTH) / 2.5) *
                upscaleSize
        );
    }
}


function hslToRgb(h: number, s: number, l: number): [number, number, number, number]{
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p: number, q: number, t: number){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}