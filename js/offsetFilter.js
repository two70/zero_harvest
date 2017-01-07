function OffsetFilter() {
  var vertexShader = null;

  var fragmentShader = [
    'precision mediump float;',
    '',
    'varying vec2 vTextureCoord;',
    '',
    'uniform vec4 dimensions;',
    'uniform vec2 offset;',
    'uniform sampler2D uSampler;',
    '',
    'void main(void)',
    '{',
    '    vec2 pixelSize = vec2(1.0) / dimensions.xy;',
    '    vec2 coord = vTextureCoord.xy - pixelSize.xy * offset;',
    '',
    '    if (coord.x < 0.0 || coord.y < 0.0 || coord.x > 1.0 || coord.y > 1.0) {',
    '        gl_FragColor = vec4(0.0);',
    '    } else {',
    '        gl_FragColor = texture2D(uSampler, coord);',
    '    }',
    '}'
  ].join('\n');

  var uniforms = {
    dimensions: {
      type: '4fv',
      value: new Float32Array([0, 0, 0, 0])
    },
    offset: {
      type: 'v2',
      value: {
        x: 50,
        y: 50
      }
    }
  };

  PIXI.AbstractFilter.call(this, vertexShader, fragmentShader, uniforms);
}

OffsetFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
OffsetFilter.prototype.constructor = OffsetFilter;