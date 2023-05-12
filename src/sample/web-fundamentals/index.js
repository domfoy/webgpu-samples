function buildRenderPipeline(ctx, module) {
  const { presentationFormat } = ctx;

  return device.createRenderPipeline({
    label: 'our hardcoded red triangle pipeline',
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs',
    },
    fragment: {
      module,
      entryPoint: 'fs',
      targets: [{ format: presentationFormat }],
    },
  });
}

function buildModule(device) {
  return device.createShaderModule({
    label: 'our hardcoded red triangle shaders',
    code: `
      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> @builtin(position) vec4f {
        var pos = array<vec2f, 3>(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );

        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }

      @fragment fn fs() -> @location(0) vec4f {
        return vec4f(1.0, 0.0, 0.0, 1.0);
      }
    `,
  });
}

function buildContext(device) {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('webgpu');
  const presentationFormat = navigator.gpu?.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
  });

  const ctx = {
    presentationFormat,
  };

  return {
    ctx,
    context,
  };
}

async function buildDevice() {
  const adapter = await gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) {
    fail('need a browser that supports WebGPU');
    return;
  }
  return device;
}

async function main() {
  const device = await buildDevice();
  const { ctx, context } = buildContext(device);
  const moduleObject = buildModule(device);
  const renderPipeline = buildRenderPipeline(ctx, moduleObject);
}

main();
