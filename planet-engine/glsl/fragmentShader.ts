export const fragmentShader = `
  varying float vElevation;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;

  void main() {
    // Normalizamos la elevación de [-0.15, 0.15] a [0.0, 1.0] para el mix de color
    float intensity = smoothstep(-0.15, 0.15, vElevation);
    
    vec3 color = mix(uColorBase, uColorAccent, intensity);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;