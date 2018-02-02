uniform vec3 color1;
uniform vec3 color2;
uniform vec2 offset;
uniform vec2 smooth;

uniform sampler2D noiseTexture;

varying vec2 screenUV;

void main() {

	float dst = length(screenUV - offset);
	dst = smoothstep(smooth.x, smooth.y, dst);

	vec3 color = mix(color1, color2, dst);

  // tile the small noise texture - technically this should be
  // passing in the screen dimensions and using those to calculate,
  // but we'll just take an intermediate value here for simplicity
  vec2 texSize = vec2( 0.2, 0.2 );
  vec2 phase = fract(  screenUV / texSize );
	vec3 noise = mix( color, texture2D( noiseTexture, phase ).rgb, 0.2 );
	// vec3 noise = mix(color, texture2D(noiseTexture, screenUV).rgb, 0.2);

	vec4 col = vec4( mix( noise, vec3( -2.6 ), dot( screenUV, screenUV ) ), 1.0 );

	gl_FragColor = col;

}