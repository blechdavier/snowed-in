precision lowp float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

uniform vec2 screenDimensions;
uniform vec2 offsetCoords;
uniform float millis;

//https://github.com/stegu/webgl-noise/blob/master/src/classicnoise2D.glsl

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
void main() {
	vec2 coord = (vec2(vTexCoord.x, (1.0-vTexCoord.y)) * screenDimensions)/5.0;

	vec2 frontSnowPos = vec2((coord.x+millis/-900.0)+sin(millis/500.0+coord.y/4.0)*0.5, (coord.y+millis/-150.0))+offsetCoords*0.9;
	vec2 backSnowPos = vec2((coord.x+millis/-400.0), (coord.y+millis/-200.0))+offsetCoords*0.75;

	gl_FragColor = vec4(0.4, 0.7, 0.9, 1.0);
	if(cnoise(frontSnowPos)>0.5 && cnoise(frontSnowPos+vec2(1.0))>0.5 || cnoise(backSnowPos)>0.4 && cnoise(backSnowPos+vec2(1.0))>0.4) {
		gl_FragColor = vec4(1.0);
	}
	
}