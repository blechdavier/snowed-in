"use strict";
class Resource {
    constructor(image, sourceX, sourceY, sourceWidth, sourceHeight) {
        this.image = image;
        if (sourceX && sourceX && sourceHeight && sourceWidth) {
            this.sourceX = sourceX;
            this.sourceY = sourceY;
            this.sourceWidth = sourceWidth;
            this.sourceHeight = sourceHeight;
        }
    }
    render(target, x, y, width, height) {
        // If the image that is being drawn is tile
        if (this.sourceX && this.sourceX && this.sourceHeight && this.sourceWidth) {
            // Confirm that a required width and height were passed
            if (!(width && height))
                throw new Error("Please specify width and height when drawing a tile");
            target.image(this.image, x, y, width, height, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight);
            return;
        }
        if (width && height) {
            target.image(this.image, x, y, width, height);
            return;
        }
        target.image(this.image, x, y);
    }
}
module.exports = Resource;
//# sourceMappingURL=Resource.js.map