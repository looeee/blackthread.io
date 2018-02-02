uniform float uTime;
uniform vec2 pointer;

attribute vec2 aAnimation;
attribute vec3 aEndPosition;

varying vec2 screenUV;

float ease(float t, float b, float c, float d) {
  return c*((t=t/d - 1.0)*t*t + 1.0) + b;
}

void main() {

  float exploder = 0.001;

  // calculate the offset based on pointer position once the initial animation is finished
  if( uTime <= 0.3 ) {

    float d = length( position.xy - pointer );
    float dist = 200.0 / d;

    // offset based on pointer position
    exploder = clamp( dist, 0.0, 20.0 ) * 0.002;

  }

  // Set up animation
  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;

  float tTime = clamp(uTime - tDelay, 0.0, tDuration);

  float tProgress = ease(tTime, 0.0, 1.0, tDuration);

  // Mix between initial and final position plus mouse position offset
  vec3 transformed = mix(position, aEndPosition, tProgress - exploder );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

  // Calculate screenspace UV
  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5;
}
