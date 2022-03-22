"use strict";
var Main_1 = require("../Main");
var UiScreen = /** @class */ (function () {
    function UiScreen() {
    }
    UiScreen.prototype.mousePressed = function () {
        console.log(this.buttons[0].txt);
        if (this.buttons !== undefined) {
            // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
            this.buttons.forEach(function (button) {
                if (button.mouseIsOver) {
                    button.onPressed();
                }
            });
        }
        if (this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for (var _i = 0, _a = this.sliders; _i < _a.length; _i++) {
                var i = _a[_i];
                i.updateSliderPosition(Main_1["default"].mouseX, Main_1["default"].mouseY);
                if (Main_1["default"].mouseX > i.x && Main_1["default"].mouseX < i.x + i.w && Main_1["default"].mouseY > i.y && Main_1["default"].mouseY < i.y + i.h)
                    i.beingEdited = true;
            }
        }
    };
    UiScreen.prototype.mouseReleased = function () {
        if (this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for (var _i = 0, _a = this.sliders; _i < _a.length; _i++) {
                var i = _a[_i];
                i.beingEdited = false;
            }
        }
    };
    return UiScreen;
}());
module.exports = UiScreen;
