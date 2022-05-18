import 'core-js-pure/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {App} from './App';
import './index.scss';
import './assets/css/styles.scss';
import {store} from './core';
// import {rootEpic} from './redux/rootEpic';
import {unregister} from './registerServiceWorker';
// import {LanguageProvider} from './core/containers/languageProvider';
// import {translationMessages} from './i18n';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
unregister();
