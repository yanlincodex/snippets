declare global {
  interface Window {
    __func: (() => void) | null;
  }
}

interface ObservedObject {
  [key: string]: any;
}

/**
 * Observe data objects and update UI
 * @param obj
 */
export const observe = (obj: ObservedObject) => {
  for(const key in obj) {
    let internalVal = obj[key];
    let funcDependencies = new Set();

    Object.defineProperty(obj, key, {
      get: () => {
        // Collect function dependencies
        if(window.__func && !funcDependencies.has(window.__func)) {
          funcDependencies.add(window.__func);
        }
        return internalVal;
      },
      set: (val: any) => {
        // Dispatch updates
        internalVal = val;

        for (let i = 0; i < funcDependencies.size; i++) {
          funcDependencies[i]();
        }
      }
    })
  }
}

/**
 * Wrap function and make accessible for observer
 * @param obj
 */
export const autoRun = (fn: () => void) => {
  window.__func = fn;
  fn();
  window.__func = null;
}
