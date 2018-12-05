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
  lodash: 'lib/lodash',
  classnames: 'lib/classnames',
  eventemitter: 'lib/eventemitter',
  eventemitter3: 'lib/eventemitter',
  moment: 'lib/moment',
  axios: 'lib/axios',
  'styled-components': 'lib/styled',
  clipboard: 'lib/clipboard',
  redux: 'lib/redux',
  'redux-thunk': 'lib/reduxThunk',
  'prop-types': 'lib/propTypes',
  'cloudstudio-extension': 'cloudstudio',
});

exports.createExternalAlias = createExternalAlias;
// // some general used packages updading
exports.generalExtenalAlias = generalExtenalAlias;
