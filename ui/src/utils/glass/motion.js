// Tabs 共用的位置弹簧；只计算展示值，不提交组件业务状态。
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const prefersReducedMotion = () => typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createSpring(value, stiffness = 1000, ratio = 1, threshold = 0.001) {
  const state = { value, target: value, velocity: 0 };
  return Object.assign(state, {
    snap(next) { state.value = state.target = next; state.velocity = 0; },
    step(seconds) {
      const displacement = state.value - state.target;
      const frequency = Math.sqrt(stiffness);
      const decay = Math.exp(-ratio * frequency * seconds);
      if (ratio < 1) {
        const damped = frequency * Math.sqrt(1 - ratio * ratio);
        const sine = Math.sin(damped * seconds);
        const cosine = Math.cos(damped * seconds);
        const coefficient = (state.velocity + ratio * frequency * displacement) / damped;
        state.value = state.target + decay * (displacement * cosine + coefficient * sine);
        state.velocity = decay * (state.velocity * cosine
          - (ratio * frequency * coefficient + damped * displacement) * sine);
      } else {
        const coefficient = state.velocity + frequency * displacement;
        state.value = state.target + (displacement + coefficient * seconds) * decay;
        state.velocity = (state.velocity - frequency * coefficient * seconds) * decay;
      }
      if (Math.abs(state.value - state.target) < threshold && Math.abs(state.velocity) < threshold) {
        state.snap(state.target);
        return false;
      }
      return true;
    },
  });
}

export function createFrameLoop(render, view = globalThis) {
  let frame = 0;
  let previous = 0;
  function tick(time) {
    frame = 0;
    const seconds = previous ? Math.min((time - previous) / 1000, 0.064) : 1 / 60;
    previous = time;
    if (render(seconds, time)) frame = view.requestAnimationFrame(tick);
    else previous = 0;
  }
  return {
    start() { if (!frame) frame = view.requestAnimationFrame(tick); },
    stop() { view.cancelAnimationFrame(frame); frame = 0; previous = 0; },
  };
}
