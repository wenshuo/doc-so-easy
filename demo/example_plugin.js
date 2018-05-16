const path = require('path');
const fs = require('fs');

let exampleId = 0;

let compile;

try {
  const babel = require('babel-core');
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc')));
  compile = (source) => {
    try {
      return babel.transform(source, babelrc).code;
    } catch (babelError) {
      // eslint-disable-next-line no-console
      console.log(source);
      throw babelError;
    }
  };
} catch (error) {
  console.log(error);
}

function createClosure(code) {
  return `
    (function() {
      ${code}
    })();
  `;
}

function getComponentClass(code) {
  return code.trim().match(/^class\s+(\S+)\s+/);
}

function createRender(isComponent, code, containerClass) {
  const sourceCode = isComponent ? `<${code} />` : code;
  return `ReactDOM.render(${sourceCode}, document.querySelector(".${containerClass}"))`
}

module.exports = {
  name: 'example',
  transform(meta) {
    if (!meta.examples) {
      return meta;
    }
    if (!Array.isArray(meta.examples)) {
      meta.examples = [meta.examples];
    }
    if (!Array.isArray(meta.properties)) {
      meta.properties = [meta.properties];
    }

    meta.examples = meta.examples.map(example => {
      if (example.type === 'jsx') {
        const containerClass = `doc-example-container-${exampleId}`;
        const component = getComponentClass(example.code);
        let codeToCompile = createRender(false, example.code, containerClass);

        if (component && component[1]) {
          codeToCompile = `
            ${example.code}
            ${createRender(true, component[1], containerClass)}
          `;
        }

        const script = compile(createClosure(codeToCompile));
        exampleId += 1;
        example.html = `
          <div class=${containerClass}></div>
          <script>${script}</script>
        `;
      } else {
        example.html = example.code;
      }
      return example;
    });
    return meta;
  }
};
