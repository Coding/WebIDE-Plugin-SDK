export function createExternalAlias(map) {
  return (context, request, callback) => {
    if (map[request]) {
      return callback(null, `root ${map[request].replace(/\//g, '.')}`);
    }
    return callback();
  };
}

// some general used packages updading
export default createExternalAlias({
  mobx: 'lib/mobx',
  'react-dom': 'lib/reactDom',
  'mobx-react': 'lib/mobxReact',
  react: 'lib/react',
});
