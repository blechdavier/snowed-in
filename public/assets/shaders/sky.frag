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

	// vec4 frontFront = texture2D(skyImage, fract(0.6*(offsetCoords / 30.0 + vec2( (coord.x+millis/-1200.0)+sin(millis/300.0+coord.y/45.0)*5.4, (coord.y+millis/-120.0)+offsetCoords*0.94 )/256.0)));
	vec4 frontSnowLayer = texture2D(skyImage, fract(0.7*(offsetCoords / 60.0 + vec2( (coord.x+millis/-900.0)+sin(coord.y/30.0)*4.0, (coord.y+millis/-150.0)+offsetCoords*0.9 )/256.0)));
	vec4 backSnowLayer = texture2D(skyImage, fract(offsetCoords / 120.0 + vec2( (coord.x+millis/-400.0)+sin(millis/300.0+(coord.y+offsetCoords.y*5.0)/22.0)*3.2, (coord.y+millis/-200.0)+offsetCoords*0.75 )/256.0));
	vec4 backBack = texture2D(skyImage, fract(1.5*(offsetCoords / 120.0 + vec2( (coord.x+millis/-300.0)+sin(millis/300.0+coord.y/16.0)*2.4, (coord.y+millis/-200.0)+offsetCoords*0.6 )/256.0)));

	gl_FragColor = vec4(vec3(0.65, 0.85, 1.0)*(1.1-0.1*vTexCoord.y) + vec3(0.35, 0.15, 0.0) * (frontSnowLayer.www+backBack.www+backSnowLayer.www), 1.0);
	
}