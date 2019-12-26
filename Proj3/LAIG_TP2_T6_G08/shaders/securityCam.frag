#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	vec2 center = vec2(0.5,0.5);
	vec4 color = texture2D(uSampler, vTextureCoord);

	if(mod(vTextureCoord.y * 15.0 - timeFactor * 0.002, 2.0) > 1.0)
		color = vec4(color.rgb + 0.8, 1.0);
	color = vec4(color.rgb * (1.0 - distance(vTextureCoord, center)), 1.0);
	gl_FragColor = vec4(color.rgb, 1.0);
}


