export class Control {
    keyboard: boolean
    keyCode: number
    description: string
    onPressed: () => void
    onReleased: () => void

    constructor(description: string, keyboard: boolean, keyCode: number, onPressed: () => void, onReleased?: () => void) {
        this.description = description
        this.keyboard = keyboard;
        this.keyCode = keyCode;
        this.onPressed = onPressed;
        this.onReleased = onReleased || function(){};//for some reason arrow function doesn't like to exist here but i'm not gonna worry too much
        //if it's too ugly, you can try to fix it
    }

}