# Aspirin Code Data Builder

> A graphical Online Judge data generator.

- Official website: http://acdb.geestack.com/
- Tutorial: http://acdb.geestack.com/introduce.html


Aspirin Code Data Builder is a graphical data generation tool designed for Online Judge problem preparation. It helps problem setters, coaches, and contest platform maintainers create, manage, and reproduce test data more efficiently. The tool brings standard-solution editing, input-file editing, C++-based data generation, batch generation, runtime argument configuration, and project archiving into a single desktop interface.

The project supports both manually written input files and programmatically generated inputs. Manual editing is useful for special scoring cases, edge cases, and carefully crafted examples, while C++ generation makes it easy to produce large-scale test files. For batch scenarios, users can define the number of generated files and pass custom runtime arguments such as data size or random seeds, making generated datasets reproducible and easier to maintain.

Aspirin Code Data Builder also supports saving the entire workspace as an `.acdb` project file. This project file stores manually written inputs, generator source code, and related parameters, allowing users to reopen, share, iterate, and regenerate data later without preserving redundant generated outputs. The final generated package includes the standard solution, input files, and output files, making it suitable for structured OJ test data production.

## Features

- Graphical desktop interface for focused data-building workflows.
- Manual input-file editing for special cases and custom test points.
- C++ generator support for large-scale input data.
- Batch generation with per-run arguments.
- Reproducible random data through custom seeds.
- `.acdb` project files for archiving, sharing, and future iteration.
- Windows and macOS builds.

## Before Usage

The CPP data-generation workflow requires a C++ compiler. On Windows, you can install MinGW or Dev-C++ and make sure `g++` is available.

In the app settings, configure the compile command. The default command is:

```bash
g++ -O2 $cppPath$
```

If `g++` is installed in a custom location, replace `g++` with the full compiler path. Keep `$cppPath$` in the command because the app replaces it with the current generator source file path.

## Development

```bash
# Install dependencies
npm install

# Serve with hot reload at localhost:9080
npm run dev

# Build Electron application for production
npm run build

# Lint JS and Vue files in src/
npm run lint
```

## Tech Stack

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli).

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
