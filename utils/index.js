import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { handleActions } from 'redux-actions';

const { CodingSDK, devToolsExtension } = window;

// registery appRegistry
export const appRegistry = (obj, callback) => {
  window.codingPackageJsonp(obj);
  if (callback) {
    callback();
  }
};

export default class {
  constructor(options) {
    this.sdk = new CodingSDK(options) || '';
    this.inializeData = this.sdk.getData() || {};
    this.currentRemoteStore = '';
  }
  getStoreByReducer(reducer) {
    const store = createStore(
    combineReducers({
      local: reducer,
      remote: handleActions({
        updateRemoteData: (state, action) => {
          return ({ ...state, ...action.data });
        },
      }, this.inializeData),
    }),
    compose(
      applyMiddleware(thunkMiddleware),
      devToolsExtension ? devToolsExtension({ name: 'plugin', instanceId: 'plugin' }) : f => f
      ));
    if (module.hot) {
    // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducer', () => {
        store.replaceReducer(reducer);
      });
    }
    this.registerLisitenerOnRemotes(store);
    return store;
  }
  registerLisitenerOnRemotes(store) {
    this.sdk.subscribeStore(subscribedData => () => {
      const previousRemoteStore = this.currentRemoteStore;
      this.currentRemoteStore = subscribedData;
      if (previousRemoteStore !== this.currentRemoteStore) {
        store.dispatch({ type: 'updateRemoteData', data: this.currentRemoteStore });
      }
    });
  }
  get injectComponent() {
    return this.sdk.injectComponent;
  }

  get request() {
    return this.sdk.utils.request;
  }
  get sdk() {
    return this._sdk;
  }
  set sdk(sdk) {
    this._sdk = sdk;
  }
  getStore() {
    return this.store;
  }
}
