## WebIDE-Plugin-SDK
 - build your plugin
 - offer sdk apis for coding webide plugins
 - dev your apps with remote hotReload
  
## dev plugin with main project
config PACKAGE_SERVER env when running main project
run yarn run dev in main project

## dev sdk with plugin
link the project to the plugin node modules

## build
you can use this sdk to build the plugin to required format
```PLUGIN=ssh://XXX.git yarn run build```
output to the ./dist
```
main
├── dist
│   ├── 0.0.1-alpha.04        // 版本号
│   ├── ├── index.js          // jsbundle
│   ├── ├── manifest.json     // 插件描述
│   └── ...          // 其他文件
└──
```

## sdk api

## todo
- [ ] improve basic sdks
- [ ] build in local env
- [ ] readme
- [ ] tests
