import * as React from 'react';
import {
    Redirect,
    Route,
    Router,
} from 'react-router-dom';
import {storage} from './common/storage';
import {DefaultCookieService} from './common/cookie/DefaultCookieService';
export class ProtectedRoutes extends React.Component<any, any> {
    cookieService: any;
    constructor(props) {
        super(props);
        this.cookieService = new DefaultCookieService(document);
    }
    componentDidMount() {
    }
    isAuthenticated() {
        const user = storage.getUser();
        return !!user;
    }

    render() {
        const { component: Component, ...rest } = this.props;
        return <Route
            {...rest}
            render={({ location }) =>
                this.isAuthenticated() ? (
                        <Component {...this.props}/> )
                 : (
                    <Redirect
                        to={{
                            pathname: `/auth?redirect=${location.pathname}${location.search}`,
                            state: { from: location }
                        }}
                    />
                )
            }
        />;
    }
}
