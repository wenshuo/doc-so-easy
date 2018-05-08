# Doc-easy
A tool for building documentation with ease.

### Tool Config
Doc-easy config is nodejs module export. Specify the config path when run doc-easy.
Example:
```
const plugin1 = require('Plugin1');
const plugin2 = require('Plugin2');

module.exports = {
  files: ['demo/**/*.doc.js'],
  templates: {
    index: {
      path: absolute-path-to-template-file,
      assets: {
        js: [
          {
            path: absolute-path-to-template-file or url
          },
          {
            copy: true,
            path: absolute-path-to-template-file
          }
        ],
        css: [
          {
            copy: true,
            path: absolute-path-to-template-file
          }
        ]
      }
    }
  },
  outDir: absolute-path-to-output-directory,
  plugins: [plugin1, plugin2]
};

```
#### files:
  Array of glob patterns to match files that contain documentation info.

#### templates:
  templates to use. The key is the name of the template, which is used in a documentation file to specify template for that file. The value is an object containing meta for the template. The path is the absolute path to the template file. Currently Doc-easy only support handlebars templates. The assets field contain js and css assets for the template. Each js and css asset config contains copy and path options. When copy is true, the asset will be copied to the directory specified in the outDir option. The path for an asset must be absolute path to file in your file system or any valid url.

#### outDir
  Path to directory for output files and assets.

#### plugins
  Array of plugins for processing documentation meta thus impacting the final output. A plugin is an object that must contain a name, and can have either a transform or publish method or both. The transform method receive the meta data object for a file and could transform any meta and must return a new meta data object. The transform method is called before writing any output html files. The publish method receive an array of meta data objects for all files matched the glob pattern defined in the files option, it should return any information needed for generating html files, and the returned info is included into the meta that passed to the handlebars template for compilation.

```
module.exports = {
  name: 'menu',
  transform(fileMeta) {
    perform any transform;
    ...
    return new meta;
  },
  publish(allFileMeta) {
    ...
    return data-to-use-by-template;
  }
}
```

### Command line options
#### --config or -c
Path to config file.

#### --watch or -w
Watch mode.

#### --verbose or -v
Display debug information.

```
doc-easy --config=path-to-config --watch --verbose
```
