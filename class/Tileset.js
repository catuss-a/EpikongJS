
function Sprite(sprite) {
    this.image = new Image();

    this.image.src = sprite.path;
    this.h = sprite.height;
    this.w = sprite.width;

    this.draw = function(ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
    	ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
}