import * as React from 'react';
import * as LazyLoadModule from 'react-loadable/lib/index';
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import AuthenticationRoutes from './authentication/AuthenticationRoutes';
import {Loading} from './common/component/Loading';
import DefaultWrapper, {WithDefaultProps} from './container/default';
import {GLOBAL_STATE, globalStateReducer, withReducer} from './core';
import NotFoundPage from './core/containers/400/page';
import UnAuthorizedPage from './core/containers/401/page';
import InternalServerErrorPage from './core/containers/500/page';
import {AssetHistoryPage} from './bigchaindb/component/asset-history-page';
import {ProtectedRoutes} from './ProtectedRoutes';
import TransactionSearch from './bigchaindb/component/TransactionSearch';
import AddMetaFormMobile from './bigchaindb/component/add_meta_form_mobile';

const BigChainRoutes = LazyLoadModule({ loader: () => import(`./bigchaindb/routes`), loading: Loading });

interface StateProps {
  anyProps?: any;
}

type AppProps = StateProps;
class StatelessApp extends React.Component<AppProps & RouteComponentProps<any>, {}> {
    render() {
        return (
            <Switch>
                <Route path='/' exact={true} render={(props) => (<Redirect to='/auth' {...props} />)}/>
                <Route path='/401' component={UnAuthorizedPage}/>
                <Route path='/500' component={InternalServerErrorPage}/>
                <Route path='/auth' component={AuthenticationRoutes}/>
                <Route path={'/getHisAssetByTransId'} component={WithDefaultProps(AssetHistoryPage)}/>
                <ProtectedRoutes path='/search' component={TransactionSearch}/>
                <ProtectedRoutes path='/append-info' component={AddMetaFormMobile}/>
                <DefaultWrapper history={this.props.history} location={this.props.location}>
                        <Route path='/bigchain' component={BigChainRoutes}/>
                        <Route path='/report' component={BigChainRoutes}/>
                        <Route path='/tracing-origin' component={BigChainRoutes}/>
                        <Route path='/searchHistoryAssetByTransId' component={BigChainRoutes}/>
                        <Route path='/product' component={BigChainRoutes}/>
                        <Route path='/providerInfo' component={BigChainRoutes}/>
                        <Route path='/gift' component={BigChainRoutes}/>
                </DefaultWrapper>
                <Route path='**' component={NotFoundPage}/>
            </Switch>
        );
  }
}

const withStore = withReducer(globalStateReducer, GLOBAL_STATE);

export const App = compose<any>(
  withStore,
  withRouter,
)(StatelessApp);
