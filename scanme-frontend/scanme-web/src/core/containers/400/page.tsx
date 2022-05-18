/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import messages from './messages';

const NotFoundPage = () => (
  <article>
    <h1>
        404: PAGE NOT FOUND
      {/*<FormattedMessage {...messages.header} />*/}
    </h1>
  </article>
);
export default NotFoundPage;
