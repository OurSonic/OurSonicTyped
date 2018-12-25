const fs = require("fs");
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/optimized.wasm"));
const imports = {};
Object.defineProperty(module, "exports", {
  asm: () => new WebAssembly.Instance(compiled, imports).exports
});
