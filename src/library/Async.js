export default function Async (proc, ...params) {
  var iterator = proc(...params)
    return new Promise((resolve, reject) => {
    let loop = (value) => {
      let result
      try {
        result = iterator.next(value);
      } catch (err) {
        reject(err);
        return;
      }
      if (result.done) {
        resolve(result.value)
      } else if (typeof result.value === "object" && typeof result.value.then === "function") {
        result.value.then(
          (value) => { loop(value); },
          (err) => { reject(err); }
        );
      } else {
        loop(result.value)
      }
    }
    loop()
  });
}