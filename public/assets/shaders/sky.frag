precision lowp float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

uniform vec2 screenDimensions;
uniform vec2 offsetCoords;
uniform sampler2D skyImage;
uniform float millis;

void main() {
	vec2 coord = (vec2(vTexCoord.x, (1.0-vTexCoord.y)) * screenDimensions)/5.0;

	vec2 frontSnowPos = vec2((coord.x+millis/-900.0)+sin(millis/500.0+coord.y/4.0)*0.6, (coord.y+millis/-150.0))+offsetCoords*0.9;
	vec2 backSnowPos = vec2((coord.x+millis/-400.0+sin(millis/500.0+coord.y/3.0)*0.45), (coord.y+millis/-200.0))+offsetCoords*0.75;

	gl_FragColor = vec4(0.65, 0.85, 1.0, 1.0)+texture2D(skyImage, fract(frontSnowPos/128.0))+texture2D(skyImage, fract(backSnowPos/128.0));
	
}