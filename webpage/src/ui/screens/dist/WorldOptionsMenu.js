"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.WorldOptionsMenu = void 0;
var UiScreen_1 = require("../UiScreen");
var UiFrame_1 = require("../UiFrame");
var Main_1 = require("../../Main");
var Button_1 = require("../Button");
var WorldCreationMenu_1 = require("./WorldCreationMenu");
var Slider_1 = require("../Slider");
var WorldOptionsMenu = /** @class */ (function (_super) {
    __extends(WorldOptionsMenu, _super);
    function WorldOptionsMenu(font) {
        var _this = _super.call(this) || this;
        // make the frame with some default values.  These will later be changed to fit the screen size.
        _this.frame = new UiFrame_1["default"](0, 0, 0, 0);
        // make some buttons with default positions
        if (Main_1["default"].worldBumpiness === undefined)
            Main_1["default"].worldBumpiness = 1;
        var tempWorldBumpinessText;
        if (Main_1["default"].worldBumpiness === 1) {
            tempWorldBumpinessText = "Normal";
        }
        else if (Main_1["default"].worldBumpiness === 0) {
            tempWorldBumpinessText = "Superflat";
        }
        else {
            tempWorldBumpinessText = "Amplified";
        }
        _this.buttons = [
            new Button_1["default"](font, "World Bumpiness: " + tempWorldBumpinessText, "Change the intensity of the world's bumps.", 0, 0, 0, 0, function () {
                if (_this.buttons[0].txt === "World Bumpiness: Normal") {
                    _this.buttons[0].txt = "World Bumpiness: Amplified";
                    Main_1["default"].worldBumpiness = 3;
                }
                else if (_this.buttons[0].txt === "World Bumpiness: Amplified") {
                    _this.buttons[0].txt = "World Bumpiness: Superflat";
                    Main_1["default"].worldBumpiness = 0;
                }
                else {
                    _this.buttons[0].txt = "World Bumpiness: Normal";
                    Main_1["default"].worldBumpiness = 1;
                }
            }),
            new Button_1["default"](font, "Back", "Return to the main menu.", 0, 0, 0, 0, function () {
                console.log("main menu");
                Main_1["default"].currentUi = new WorldCreationMenu_1.WorldCreationMenu(font);
            })
        ];
        _this.sliders = [
            new Slider_1["default"](512, 64, 2048, 64, 0, 0, 0, 0, function () {
                Main_1["default"].worldWidth = _this.sliders[0].value;
            }),
            new Slider_1["default"](64, 64, 512, 16, 0, 0, 0, 0, function () {
                Main_1["default"].worldHeight = _this.sliders[1].value;
            })
        ];
        // update the size of the elements based on the initial screen size
        _this.windowUpdate();
        return _this;
    }
    WorldOptionsMenu.prototype.render = function (target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        this.buttons.forEach(function (button) {
            button.render(target, upscaleSize);
        });
        // loop through the sliders array and render each one.
        this.sliders.forEach(function (slider) {
            slider.render(target, upscaleSize);
        });
    };
    WorldOptionsMenu.prototype.windowUpdate = function () {
        // set the position of the frame
        this.frame.x = Main_1["default"].width / 2 - 200 / 2 * Main_1["default"].upscaleSize; // center the frame in the center of the screen
        this.frame.y = Main_1["default"].height / 2 - 56 * Main_1["default"].upscaleSize;
        this.frame.w = 200 * Main_1["default"].upscaleSize;
        this.frame.h = 48 * Main_1["default"].upscaleSize;
        // set the positions of all the buttons
        for (var i = 0; i < 2; i++) {
            this.buttons[i].x = Main_1["default"].width / 2 - 192 / 2 * Main_1["default"].upscaleSize;
            this.buttons[i].y = Main_1["default"].height / 2 + 60 * i * Main_1["default"].upscaleSize;
            this.buttons[i].w = 192 * Main_1["default"].upscaleSize;
            this.buttons[i].h = 16 * Main_1["default"].upscaleSize;
            this.buttons[i].updateMouseOver(Main_1["default"].mouseX, Main_1["default"].mouseY);
        }
        // set the positions of all the sliders
        for (var i = 0; i < 2; i++) {
            this.sliders[i].x = Main_1["default"].width / 2 - 192 / 2 * Main_1["default"].upscaleSize;
            this.sliders[i].y = Main_1["default"].height / 2 + 20 + 20 * i * Main_1["default"].upscaleSize;
            this.sliders[i].w = 192 * Main_1["default"].upscaleSize;
            this.sliders[i].h = 16 * Main_1["default"].upscaleSize;
            if (Main_1["default"].mouseIsPressed)
                this.sliders[i].updateSliderPosition(Main_1["default"].mouseX, Main_1["default"].mouseY);
        }
    };
    return WorldOptionsMenu;
}(UiScreen_1["default"]));
exports.WorldOptionsMenu = WorldOptionsMenu;
