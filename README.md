# Doc-so-easy
A tool for building documentation with ease.

### Tool Config
Doc-so-easy config is nodejs module export. Specify the config path when run doc-so-easy.
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
  useParser(filePath) {
    return parser;
  },
  outDir: absolute-path-to-output-directory,
  plugins: [plugin1, plugin2]
};

```
#### files:
  Array of glob patterns to match files that contain documentation info.

#### templates:
  templates to use. The key is the name of the template, which is used in a documentation file to specify template for that file. The value is an object containing meta for the template. The path is the absolute path to the template file. Currently Doc-so-easy only support handlebars templates. The assets field contain js and css assets for the template. Each js and css asset config contains copy and path options. When copy is true, the asset will be copied to the directory specified in the outDir option. The path for an asset must be absolute path to file in your file system or any valid url.

#### outDir
  Path to directory for output files and assets.

#### outputFilePath
  By default, Doc-so-easy will output all files to the directory specified  by outDir.
  If we want to organize the output files in a custom structure, specify the outputFilePath function.
  The function will receive the meta data of a file and should return a path(including the file name).

#### useParser
  Specify what parser to use for a file. By default, it use simple parser to parse all files.
  Add useParser option tto use custom parsers. useParser function receive file path as argument,
  and must return a parser. See the custom parser section for more details.

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

### Documentation format
The default parser expects documentation meta to be defined as javascript object.
```
icon.doc.js

module.exports = {
  name: 'Icon',
  category: 'js',
  subcategory: 'components',
  description: 'Icon component.',
  examples: [
    {
      title: 'example 1',
      type: 'html',
      description: 'icon example',
      code: `
        <Icon />
      `
    }
  ]
}
```
The meta can contain anything as long as the custom plugins and custom templates understand and able to consume.

#### Custom parser
Documentation meta can be specified in any format, comments, js objects or anything that can be parsed by a parser.

A parser is an object that must contain a name and execute method.
The execute method take the file path as argument and should return an object contains file meta data to be consumed by plugins and templates.

```
module.exports = {
  name: 'comment parser',
  execute(filePath) {
    read file
    parse comments
    return object    
  }
}
```

### Command line options
#### --config or -c
Path to config file.

#### --watch or --watch=directory-to-watch or -w
Watch mode.

#### --verbose or -v
Display debug information.

```
doc_so_easy --config=path-to-config --watch --verbose
```

### Demo
To see demo locally, run
```
yarn build
yarn server
```
then navigate to localhost:3000
