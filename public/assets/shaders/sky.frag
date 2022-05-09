precision lowp float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

uniform vec2 screenDimensions;
uniform vec2 offsetCoords;
uniform sampler2D skyImage;
uniform float millis;

void main() {
	vec2 coord = (vec2(vTexCoord.x, (1.0-vTexCoord.y)) * screenDimensions);

	vec4 frontSnowLayer = texture2D(skyImage, fract(offsetCoords / 60.0 + vec2( (coord.x+millis/-900.0)+sin(millis/300.0+coord.y/30.0)*2.0, (coord.y+millis/-150.0)+offsetCoords*0.9 )/256.0));
	vec4 backSnowLayer = texture2D(skyImage, fract(offsetCoords / 120.0 + vec2( (coord.x+millis/-400.0)+sin(millis/300.0+coord.y/22.0)*1.6, (coord.y+millis/-200.0)+offsetCoords*0.75 )/256.0));

	gl_FragColor = vec4(vec3(0.65, 0.85, 1.0)*(1.1-0.1*vTexCoord.y) + vec3(0.35, 0.15, 0.0) * (frontSnowLayer.www+backSnowLayer.www), 1.0);
	
}