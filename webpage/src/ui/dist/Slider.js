"use strict";
var Assets_1 = require("../assets/Assets");
var Main_1 = require("../Main");
var Slider = /** @class */ (function () {
    function Slider(font, txt, value, min, max, step, x, y, w, h, onChanged) {
        this.value = value;
        this.min = min;
        this.max = max;
        this.step = step;
        this.onChanged = onChanged;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.beingEdited = false;
    }
    Slider.prototype.render = function (target, upscaleSize) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        var x = Math.round(this.x / upscaleSize) * upscaleSize;
        var y = Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize;
        var w = Math.round(this.w / upscaleSize) * upscaleSize;
        // left side of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 0, 0, 2, 4);
        // right side of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x + w - 2 * upscaleSize, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 3, 0, 2, 4);
        // center of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x + 2 * upscaleSize, y - 2 * upscaleSize, w - 4 * upscaleSize, 4 * upscaleSize, 2, 0, 1, 4);
        // handle
        Assets_1.UiAssets.slider_handle.render(target, x + Math.round((this.value - this.min) / (this.max - this.min) * (w - 8 * upscaleSize) / upscaleSize) * upscaleSize, y - 4 * upscaleSize, 8 * upscaleSize, 9 * upscaleSize);
    };
    Slider.prototype.updateSliderPosition = function (mouseX, mouseY) {
        console.log(this.beingEdited);
        if (this.beingEdited && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.value = Math.max(this.min, Math.min(this.max, Math.round((this.min + (this.max - this.min) * (((mouseX - this.x - 4 * Main_1["default"].upscaleSize) / (this.w - (8 * Main_1["default"].upscaleSize))))) / this.step) * this.step));
            this.onChanged();
        }
    };
    return Slider;
}());
module.exports = Slider;
