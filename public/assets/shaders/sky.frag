precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

uniform vec2 screenDimensions;
uniform vec2 offsetCoords;
uniform float millis;

float rand(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }//pseudorandom number generator

float noise(vec2 p){//lerped random values (value noise implementation from stackoverflow I think)
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fractalnoise(vec2 p) {//noise but layered to make it more like hills and less like tv noise
	return(0.3*noise(p*0.6)+0.3*noise(p*0.9)+0.2*noise(p*1.4)+0.12*noise(p*1.7)+0.08*noise(p*3.1));
}

bool isSnow(vec2 p, float w) {
	vec2 gridSquare = floor(p);
	vec2 posInSquare = fract(p);
	vec2 randPos = vec2(rand(gridSquare), rand(vec2(gridSquare.y+0.2, gridSquare.x-14134.12))) * (1.0-w);
	return posInSquare.x>randPos.x && posInSquare.x-randPos.x<w && posInSquare.y>randPos.y && posInSquare.y-randPos.y<w;
}

void main() {
	vec2 coord = (vec2(vTexCoord.x, (1.0-vTexCoord.y)) * screenDimensions)/10.0;
	
	vec3 skyColor = mix(vec3(0.74, 0.78, 0.75)*(40.0+fractalnoise(coord))/41.0, vec3(0.56, 0.61, 0.64), coord.y/10.0);

	vec2 frontSnowPos = vec2((coord.x+millis/-300.0)*2.0, (coord.y+millis/-150.0)*2.0)+offsetCoords*0.9;
	vec2 backSnowPos = vec2((coord.x+millis/-400.0)*2.0, (coord.y+millis/-200.0)*2.0)+offsetCoords*0.75;

	//(coord.x+millis/-300.0)*2.0+noise(vec2((coord.x+millis/-300.0), millis/200.0)/5.0)*1.5
	bool snowBool = (rand(floor(frontSnowPos))>0.9 && isSnow(frontSnowPos, 0.3)) || (rand(floor(backSnowPos))>0.6 && isSnow(backSnowPos, 0.2));
	

	
	if(snowBool) {
		gl_FragColor = vec4(1.0);
	}
	else {
		gl_FragColor = vec4(skyColor, 1.0);
	}
	
}