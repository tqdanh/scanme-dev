import * as H from 'history';
import * as React from 'react';
import {connect} from 'react-redux';
import {Route, RouteComponentProps, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {updateGlobalState} from '../common/redux/action/actions';
import {WithDefaultProps} from '../container/default';
import { SupplyChainForm } from './component/supply-chain-form';
import { ReportForm } from './component/report-form';
import {TracingOriginForm} from './component/tracing-origin-form';
import {AssetHistoryPage} from './component/asset-history-page';
import ReportDetailForm from './component/report-detail-form';
import {ProductList} from './component/product/product-list.component';
import {AddProductForm} from './component/product/add-product-form';
import {Switch} from 'react-router-dom';
import {ItemList} from './component/item/item-list.component';
import {AddItemForm} from './component/item/item-add.component';
import {UpdateItemsForm} from './component/item/items-update.component';
import {ProviderInfoForm} from './component/provider/provider-display-info.component';
import {AddEditGiftForm} from './component/provider/gift-edit.component';
interface AppProps {
  history: H.History;
  setGlobalState: (data: any) => void;
}

class StatelessApp extends React.Component<AppProps & RouteComponentProps<any>, {}> {
  render() {
    const commonProps = {
      rootUrl: this.props.match.url,
      exact: true,
      setGlobalState: this.props.setGlobalState,
    };
      return (
          <React.Fragment>
              <Switch>
                  <Route path={'/bigchain'} exact={true} {...commonProps} component={WithDefaultProps(SupplyChainForm)}/>
                  <Route path={'/report'} exact={true} {...commonProps} component={WithDefaultProps(ReportForm)}/>
                  <Route path={'/report/product/:id'} exact={true} {...commonProps}
                         component={WithDefaultProps(ReportDetailForm)}/>
                  <Route path={'/tracing-origin'} exact={true} {...commonProps}
                         component={WithDefaultProps(TracingOriginForm)}/>
                  <Route  path={'/searchHistoryAssetByTransId'} exact={true} {...commonProps}
                         component={WithDefaultProps(AssetHistoryPage)}/>
                  <Route path={'/product'} exact={true} {...commonProps}
                         component={WithDefaultProps(ProductList)}/>
                  <Route path={'/product/add'} exact={true} {...commonProps}
                         component={WithDefaultProps(AddProductForm)}/>
                  <Route path={'/product/:id/edit'} exact={true} {...commonProps}
                         component={WithDefaultProps(AddProductForm)}/>
                  <Route path={'/product/:id/item'} exact={true} {...commonProps}
                         component={WithDefaultProps(ItemList)}/>
                  <Route path={'/product/:id/item/add'} exact={true} {...commonProps}
                         component={WithDefaultProps(AddItemForm)}/>
                  <Route path={'/product/:id/item/update'} exact={true} {...commonProps}
                         component={WithDefaultProps(UpdateItemsForm)}/>
                  <Route path={'/providerInfo'} exact={true} {...commonProps}
                         component={WithDefaultProps(ProviderInfoForm)}/>
                  <Route path={'/gift/add'} exact={true} {...commonProps}
                         component={WithDefaultProps(AddEditGiftForm)}/>
                  <Route path={'/gift/:id/edit'} exact={true} {...commonProps}
                         component={WithDefaultProps(AddEditGiftForm)}/>
              </Switch>
          </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setGlobalState: (res) => dispatch(updateGlobalState(res))
  };
}

const withConnect = connect(null, mapDispatchToProps);

const BigChainRoutes = compose<any>(
  withRouter,
  withConnect
)(StatelessApp);
export default BigChainRoutes;
