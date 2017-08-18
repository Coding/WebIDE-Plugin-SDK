function createExternalAlias(map) {
  return (context, request, callback) => {
    if (map[request]) {
      return callback(null, `root ${map[request].replace(/\//g, '.')}`);
    }
    return callback();
  };
}

const generalExtenalAlias = createExternalAlias({
  mobx: 'lib/mobx',
  'react-dom': 'lib/reactDom',
  'mobx-react': 'lib/mobxReact',
  react: 'lib/react',
});

exports.createExternalAlias = createExternalAlias;
// // some general used packages updading
exports.generalExtenalAlias = generalExtenalAlias;
