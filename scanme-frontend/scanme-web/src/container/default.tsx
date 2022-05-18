import * as React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/logo1.png';
import {
    BaseComponent,
    BaseInternalState,
    DateUtil,
    DefaultCookieService,
    HistoryProps,
    ResourceManager,
    storage,
    StringUtil,
    UIUtil
} from '../core';
import {NavLink} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import BusinessIcon from '@material-ui/icons/Business';
import ShopingCartIcon from '@material-ui/icons/ShoppingCart';
import ReportIcon from '@material-ui/icons/Assignment';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import {Base64} from 'js-base64';
import applicationContext from '../bigchaindb/config/ApplicationContext';
import {Button, ListItem, Tooltip, Typography} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
interface InternalState extends BaseInternalState {
    pageSizes: number[];
    pageSize: number;
    authenticationService: any;
    se: any;
    isToggleMenu: boolean;
    isToggleSidebar: boolean;
    isToggleSearch: boolean;
}

import './default.scss';
export default class DefaultWrapper extends BaseComponent<HistoryProps, InternalState> {
    cookieService: any;
    pageSize = 20;
    pageSizes = [10, 20, 50, 100, 200, 500, 1000];
    private readonly organizationService = applicationContext.getOrganizationService();

    constructor(props) {
        super(props);
        this.renderForm = this.renderForm.bind(this);
        this.renderForms = this.renderForms.bind(this);
        this.cookieService = new DefaultCookieService(document);
        this.state = {
            pageSizes: [10, 20, 50, 100, 200, 500, 1000],
            pageSize: 10,
            authenticationService: undefined,
            se: {},
            keyword: '',
            classProfile: '',
            isToggleMenu: false,
            isToggleSidebar: false,
            isToggleSearch: false,
            forms: [],
            userName: '',
            userType: '',
            displayUserName: '',
            organizationName: '',
        };
    }

    pageSizeChanged = () => {

    }

    componentDidMount() {
        // TODO : TB temporary fix form service null .
        /*
        if (!this.formService) {
          this.formService = new FormServiceImpl();
        }
        this.formService.getMyForm().subscribe(forms => {
          if (forms) {
            this.setState({ forms });
          } else {
            logger.warn('DefaultWrapper:  cannot load form from cache , re direct');
            this.props.history.push('/');
          }
        });
        */

        // check if user is properly login
        const user = storage.getUser();
        if (!user) {
            if (this.props.location.pathname !== '/getHisAssetByTransId') {
                UIUtil.showToast('Please login into your session');
                this.requireAuthentication();
                return;
            }
        } else {
            const str = this.cookieService.get('data'); // @todo: re-validate cookie expired use case
            if (!!str && str.length > 0) {
                try {
                    const tmp: any = JSON.parse(Base64.decode(str));
                    if (!tmp.userName || !tmp.password) {
                        UIUtil.showToast('Session expired');
                        this.navigate('auth');
                        return;
                    }
                } catch (error) {
                }
            }
        }

        const forms = storage.getForms();
        this.setState({forms});

        const userName = storage.getUserName();
        const displayUserName = storage.getDisplayUserName();
        const storageRole = storage.getUserType();
        this.setState({userName, userType: storageRole, displayUserName});

        const providerId = storage.getProviderIdOfUser();
        if (providerId) {
            this.organizationService.getOrganizationByOrgId(providerId).subscribe((orgInfo: any) => {
                if (orgInfo !== 'error') {
                    this.setState({organizationName: orgInfo.organizationName});
                }
            });
        }
    }

    clearKeywordOnClick = () => {
        this.setState({
            keyword: ''
        });
    }

    activeWithPath = (path, isParent, features?: any) => {
        if (isParent && features && Array.isArray(features)) {
            const hasChildLink = features.some(item => this.props.location.pathname.startsWith(item['link']));
            return path && this.props.location.pathname.startsWith(path) && hasChildLink ? 'active' : '';
        }
        return path && this.props.location.pathname.startsWith(path) ? 'active' : '';
    }

    toggleMenuItem = (event) => {
        let target = event.currentTarget;
        const currentTarget = event.currentTarget;
        const elI = currentTarget.querySelectorAll('.menu-item > i')[1];
        if (elI) {
            if (elI.classList.contains('down')) {
                elI.classList.remove('down');
                elI.classList.add('up');
            } else {
                if (elI.classList.contains('up')) {
                    elI.classList.remove('up');
                    elI.classList.add('down');
                }
            }
        }
        if (currentTarget.nextElementSibling) {
            currentTarget.nextElementSibling.classList.toggle('expanded');
        }
        if (target.nodeName === 'A') {
            target = target.parentElement;
        }
        if (target.nodeName === 'LI') {
            target.classList.toggle('open');
        }
    }

    searchOnClick = () => {

    }
    toggleSearch = () => {
        this.setState((prev) => ({isToggleSearch: !prev.isToggleSearch}));
    }

    toggleMenu = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.setState((prev) => ({isToggleMenu: !prev.isToggleMenu}));
    }

    toggleSidebar = () => {
        this.setState((prev) => ({isToggleSidebar: !prev.isToggleSidebar}));
    }

    toggleProfile = () => {
        this.setState(prevState => {
            return {classProfile: prevState.classProfile === 'show' ? '' : 'show'};
        });
    }

    signout = ($event) => {
        $event.preventDefault();
        /*
        this.signoutService.signout(GlobalApps.getUserName()).subscribe(success => {
          if (success === true) {
            this.navigate('signin');
          }
        }, this.handleError);
        */
        /*
         const url = config.authenticationServiceUrl + '/authentication/signout/' + GlobalApps.getUserName();
         WebClientUtil.get(this.http, url).subscribe(
           success => {
             if (success) {
               sessionStorage.setItem('authService', null);
               sessionStorage.clear();
               GlobalApps.setUser(null);
               this.navigate('signin');
             }
           },
           err => this.handleError(err)
         );
         */
        sessionStorage.setItem('authService', '');
        sessionStorage.clear();
        storage.setUser(null);
        this.navigate('');
    }

    viewMyprofile = (e) => {
        e.preventDefault();
        this.navigate('/my-profile');
    }


    viewMySetting = (e) => {
        e.preventDefault();
        this.navigate('/my-profile/my-settings');
    }


    viewChangePassword = (e) => {
        e.preventDefault();
        this.navigate('/auth/change-password');
    }

    renderForms = (features) => {
        return (
            features.map((feature, index) => {
                return this.renderForm(index, feature);
            })
        );
    }

    onMouseHover = (e) => {
        e.preventDefault();
        const sysBody = (window as any).sysBody;
        if (sysBody.classList.contains('top-menu') && window.innerWidth > 768) {
            const navbar = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
            const icons = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
            if (navbar.length > 0) {
                for (let i = 0; i < navbar.length; i++) {
                    navbar[i].classList.toggle('expanded');
                    if (icons[i]) {
                        icons[i].className = 'entity-icon down';
                    }
                }
            }
        }
    }

    onShowAllMenu = (e) => {
        e.preventDefault();
        const sysBody = (window as any).sysBody;
        if (sysBody.classList.contains('top-menu2')) {
            const navbar = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>ul.list-child'));
            const icons = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>a>i.down'));
            if (navbar.length > 0) {
                let i = 0;
                for (i = 0; i < navbar.length; i++) {
                    navbar[i].className = 'list-child expanded';
                    if (icons[i]) {
                        icons[i].className = 'entity-icon up';
                    }
                }
            }
        }
    }

    onHideAllMenu = (e) => {
        e.preventDefault();
        const sysBody = (window as any).sysBody;
        if (sysBody.classList.contains('top-menu2')) {
            const navbar = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
            const icons = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
            if (navbar.length > 0) {
                let i = 0;
                for (i = 0; i < navbar.length; i++) {
                    navbar[i].className = 'list-child';
                    if (icons[i]) {
                        icons[i].className = 'entity-icon down';
                    }
                }
            }
        }
    }

    renderForm = (key: any, module: any) => {
        const name = StringUtil.isEmpty(this.resource[module.resourceKey]) ? module.name : this.resource[module.resourceKey];
        if (module.status !== 'A') {
            return (null);
        } else if (module.modules && Array.isArray(module.modules)) {
            const className = StringUtil.isEmpty(module.className) ? 'settings' : module.className;
            const link = module.link;
            const features = module.modules;
            return (
                <li key={key}
                    className={'open ' + this.activeWithPath(link, true, features)} /* onBlur={this.menuItemOnBlur} */>
                    <a className='menu-item' href='#' onClick={this.toggleMenuItem}>
                        <i className='material-icons'>{className}</i><span>{name}</span>
                        <i className='entity-icon down'/>
                    </a>
                    <ul className='list-child'>
                        {this.renderForms(features)}
                    </ul>
                </li>
            );
        } else {
            const className = StringUtil.isEmpty(module.className) ? 'settings' : module.className;
            return (
                <li key={key} className={this.activeWithPath(module.link, false)}>
                    <Link to={module.link}>
                        <i className='material-icons'>{className}</i><span>{name}</span>
                    </Link>
                </li>
            );
        }
    }

    handleClick = event => {
        this.setState({'anchorEl': event.currentTarget});
    }

    handleClose = () => {
        this.setState({'anchorEl': null});
    }

    render() {
        const resource = ResourceManager.getResource();
        const {children} = this.props;
        const {isToggleSidebar, isToggleMenu, isToggleSearch, userType, displayUserName, organizationName} = this.state;
        const topClassList = ['sidebar-parent'];
        if (isToggleSidebar) {
            topClassList.push('sidebar-off');
        }
        if (isToggleMenu) {
            topClassList.push('menu-on');
        }
        if (isToggleSearch) {
            topClassList.push('search');
        }
        const topClass = topClassList.join(' ');
        const user = storage.getUser();
        return (
            <div className={topClass}>
                <div className='menu sidebar'>
                    <nav>
                        <i className='toggle-menu' onClick={this.toggleMenu}/>
                        <p className='sidebar-off-menu'>
                            <MenuIcon className='material-icons nav-list-item icon' onClick={this.toggleSidebar}/>
                        </p>
                        <ListItem className='nav-list-item' disableGutters>
                            <NavLink className='nav-list-item button-like' activeClassName='active-item'
                                     to='/bigchain'>
                                <HomeIcon className='material-icons nav-list-item icon'/> {this.state.isToggleSidebar ? '' : resource.home_page}
                            </NavLink>
                            <NavLink className='nav-list-item button-like hidden' activeClassName='active-item'
                                     to='/bigchain'>
                                <HomeIcon className='material-icons nav-list-item icon'/>
                            </NavLink>
                        </ListItem>
                        <ListItem className='nav-list-item' disableGutters>
                            <NavLink className='nav-list-item button-like' activeClassName='active-item'
                                     to='/providerInfo'> <BusinessIcon className='material-icons nav-list-item icon'/> {this.state.isToggleSidebar ? '' : resource.provider_page}
                            </NavLink>
                            <NavLink className='nav-list-item button-like hidden' activeClassName='active-item'
                                     to='/providerInfo'> <BusinessIcon className='material-icons nav-list-item icon'/>
                            </NavLink>
                        </ListItem>
                        <ListItem className='nav-list-item' disableGutters>
                            <NavLink className='nav-list-item button-like' activeClassName='active-item'
                                     to='/product'><ShopingCartIcon className='material-icons nav-list-item icon'/> {this.state.isToggleSidebar ? '' : resource.product_page}
                            </NavLink>
                            <NavLink className='nav-list-item button-like hidden' activeClassName='active-item'
                                     to='/product'><ShopingCartIcon className='material-icons nav-list-item icon'/>
                            </NavLink>
                        </ListItem>
                        <ListItem className='nav-list-item' disableGutters>
                            <NavLink className='nav-list-item button-like' activeClassName='active-item'
                                     to='/report'><ReportIcon className='material-icons nav-list-item icon'/> {this.state.isToggleSidebar ? '' : resource.report_page}
                            </NavLink>
                            <NavLink className='nav-list-item button-like hidden' activeClassName='active-item'
                                     to='/report'><ReportIcon className='material-icons nav-list-item icon'/>
                            </NavLink>
                        </ListItem>
                        <ListItem className='nav-list-item' disableGutters>
                            <NavLink className='nav-list-item button-like' activeClassName='active-item'
                                     to='/tracing-origin' isActive={(match, location) => location.pathname === '/searchHistoryAssetByTransId' || location.pathname === '/tracing-origin'}><SearchIcon className='material-icons nav-list-item icon'/> {this.state.isToggleSidebar ? '' : resource.tracing_origin_page}
                            </NavLink>
                            <NavLink className='nav-list-item button-like hidden' activeClassName='active-item'
                                     to='/tracing-origin' isActive={(match, location) => location.pathname === '/searchHistoryAssetByTransId' || location.pathname === '/tracing-origin'}><SearchIcon className='material-icons nav-list-item icon'/>
                            </NavLink>
                        </ListItem>
                    </nav>
                </div>
                <div className='page-container'>
                    <div className='page-header'>
                        <form>
                            <div className='search-group'>
                                    <img className='logo' src={logo}
                                         alt='Logo of The Company'/>
                                    <Typography style={{
                                        position: 'absolute',
                                        fontSize: 20,
                                        marginLeft: 64,
                                        color: '#fff'
                                    }}>{organizationName}</Typography>
                                <section>
                                    {/*<NotificationImportantIcon style={{width: 32, height: 32}}/>*/}
                                    {/*<EmailIcon style={{width: 32, height: 32, marginLeft: 8}}/>*/}
                                    {(!user || !user.imageURL) &&
                                    <PersonIcon style={{width: 32, height: 32, marginLeft: 8, marginRight: 8}}
                                                onClick={this.handleClick}/>}
                                    <Menu
                                        id='simple-menu'
                                        anchorEl={this.state.anchorEl}
                                        keepMounted
                                        open={Boolean(this.state.anchorEl)}
                                        onClose={this.handleClose}
                                    >
                                        <MenuItem>
                                            <p>{resource.org_name}: {organizationName}</p>
                                        </MenuItem>
                                        <MenuItem>
                                            <p>{resource.display_name2}: {displayUserName}</p>
                                        </MenuItem>
                                        <MenuItem>
                                            <p>{resource.role}: Người quản trị</p>
                                        </MenuItem>
                                        <Divider light/>
                                        <MenuItem onClick={this.signout}>
                                            <a>{resource.logout_btn}</a>
                                        </MenuItem>
                                    </Menu>
                                </section>
                            </div>
                        </form>
                    </div>
                    <div className='page-body'>
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        );
    }

}

export const WithDefaultProps = (Component: any) => (props: HistoryProps) => <Component props={props} history={props.history}/>;
