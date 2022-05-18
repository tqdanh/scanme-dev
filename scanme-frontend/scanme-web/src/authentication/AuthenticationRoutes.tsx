import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {SigninForm} from './component/signin-form';

interface StateProps {
  anyProps?: any;
}

type AppProps = StateProps;
class StatelessApp extends React.Component<AppProps & RouteComponentProps<any>, {}> {
  render() {
    const currentUrl = this.props.match.url;
    return (
      <Switch>
        <Route path={currentUrl + '/signin'} exact={true} component={SigninForm} />
        <Route path={currentUrl} exact={true} component={SigninForm} />
      </Switch>
    );
  }
}

const AuthenticationRoutes = compose(
  withRouter,
)(StatelessApp);
export default AuthenticationRoutes;
