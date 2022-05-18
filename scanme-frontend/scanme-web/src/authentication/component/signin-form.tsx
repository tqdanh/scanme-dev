import {Base64} from 'js-base64';
import * as React from 'react';
import {
    BaseComponent,
    BaseInternalState,
    CookieService,
    DateUtil,
    DefaultCookieService,
    HistoryProps,
    ResourceManager,
    storage,
    StringUtil,
    UIUtil,
} from '../../core';
import applicationContext from '../config/ApplicationContext';
import {SigninInfo} from '../model/SigninInfo';
import {SigninResult} from '../model/SigninResult';
import {SigninStatus} from '../model/SigninStatus';
import {AuthenticationService} from '../service/AuthenticationService';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import scanme_big from '../../assets/images/scanme_big.png';
import {CryptoUtil} from '../../common/util/CryptoUtil';
import * as CryptoJS from 'crypto-js';
interface InternalState extends BaseInternalState {
    userName: string;
    password: string;
    remember: boolean;
    cookieService: CookieService;
}

function Copyright() {
    return (
        <Typography variant='body2' color='textSecondary' align='center'>
            {'© Copyright 2019 TMA Solutions'}
            {/*<Link color='inherit' href='https://material-ui.com/'>*/}
            {/*  Your Website*/}
            {/*</Link>{' '}*/}
            {/*{new Date().getFullYear()}*/}
            {/*{'.'}*/}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        // background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
        background: 'url(\'login_background.jpg\')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignInSide = (props) => {
    // @ts-ignore
    const resource = ResourceManager.getResource();
    const classes = useStyles({});
    return (
        <Grid container component='main' className={classes.root}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img className={classes.avatar} src={scanme_big} alt='ScanMe logo' width={80} height={80}/>
                    <Typography component='h1' variant='h5'>
                        {resource.sign_in_form}
                    </Typography>
                    <form id='signinForm' name='signinForm' className={classes.form} noValidate autoComplete='off'>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='userName'
                            label={resource.username}
                            name='userName'
                            value={props._this.state.userName}
                            placeholder={resource.placeholder_user_name}
                            onChange={(event) => props._this.setState({userName: event.target.value})}
                            autoComplete='off'
                            autoFocus
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            value={props._this.state.password}
                            placeholder={resource.placeholder_password}
                            label={resource.password}
                            onChange={(event) => props._this.setState({password: event.target.value})}
                            type='password'
                            id='password'
                            autoComplete='off'
                        />
                        <FormControlLabel
                            control={<Checkbox checked={props._this.state.remember} value='remember' color='secondary'
                                               onChange={(event) => props._this.setState({remember: event.target.checked})}/>}
                            label={resource.signin_remember_me}
                        />
                        <div className={'message ' + props._this.alertClass}>
                          {props._this.state._message}
                          <span
                              onClick={props._this.hideMessage}
                              hidden={!props._this.state._message || props._this.state._message === ''}
                          />
                        </div>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='secondary'
                            className={classes.submit}
                            onClick={props._this.signin}
                        >
                            {resource.button_signin}
                        </Button>
                        {/*<Grid container>*/}
                        {/*    <Grid item xs>*/}
                        {/*        <Link href='#' variant='body2'>*/}
                        {/*            Forgot password?*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item>*/}
                        {/*        <Link href='#' variant='body2'>*/}
                        {/*            {'Don\'t have an account? Sign Up'}*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                        <Box mt={5}>
                            <Copyright/>
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export class SigninForm extends BaseComponent<HistoryProps, InternalState> {
    private authenticationService: AuthenticationService;

    constructor(props) {
        super(props);
        this.signin = this.signin.bind(this);
        this.signup = this.signup.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.authenticationService = applicationContext.getAuthenticationService();
        const cookieService = new DefaultCookieService(document);
        const str = cookieService.get('data');
        let userName = '';
        let password = '';
        const remember = true;
        if (!!str && str.length > 0) {
            try {
                const tmp: any = JSON.parse(Base64.decode(str));
                userName = tmp.userName;
                password = tmp.password;
            } catch (error) {
            }
        }
        this.state = {
            userName,
            password,
            remember,
            cookieService,
        };
    }

    componentDidMount() {
        // check if user has properly sign-in
        const user = storage.getUser();
        if (user) {
            this.navigate('bigchain');
            return;
        }
    }

    forgotPassword() {
        // this.navigate('/auth/forgot-password');
    }

    signup() {
        // this.navigate('connect/signup');
    }

    succeed(result: SigninResult) {
        storage.setUser(result.user);
        const forms = result.user.hasOwnProperty('modules')
            ? result.user.modules
            : null;
        if (forms !== null && forms.length !== 0) {
            storage.setForms(null);
            storage.setForms(forms);
        }
        this.navigateToHome();
    }

    signin(event) {
        event.preventDefault();
        let valid = true;
        if (StringUtil.isEmpty(this.state.userName)) {
            valid = false;
            const msg = ResourceManager.format('error_required', 'user_name');
            this.showDanger(msg);
        } else if (StringUtil.isEmpty(this.state.password)) {
            valid = false;
            const msg = ResourceManager.format('error_required', 'password');
            this.showDanger(msg);
        }

        if (valid === false) {
            return;
        }
        const cookieService = this.state.cookieService;
        const remember = this.state.remember;
        const encryptedPassword = CryptoUtil.encryptRC4(CryptoJS, this.state.password, 'secretKey');
        const user: SigninInfo = {
            userName: this.state.userName,
            password: encryptedPassword,
        };
        this.authenticationService
            .authenticate(user)
            .subscribe((result: SigninResult) => {
                const status = result.status;
                if (
                    // tslint:disable-next-line: triple-equals
                    status == SigninStatus.Success ||
                    // tslint:disable-next-line: triple-equals
                    status == SigninStatus.SuccessAndReactivated
                ) {
                    if (remember === true) {
                        const data = {
                            userName: user.userName,
                            password: this.state.password,
                        };
                        const expiredDate = DateUtil.addDays(DateUtil.now(), 7);
                        cookieService.set(
                            'data',
                            Base64.encode(JSON.stringify(data)),
                            expiredDate,
                        );
                    } else {
                        cookieService.delete('data');
                    }
                    const expiredDays = DateUtil.dayDiff(
                        new Date(result.user.passwordExpiredTime),
                        DateUtil.now(),
                    );
                    if (expiredDays <= 3) { // set the expired time of password near 3 days
                        const message2 = ResourceManager.getString(
                            'msg_password_expired_soon'
                        );
                        UIUtil.showToast(message2.replace('{0}', `${expiredDays}`));
                    }
                    // tslint:disable-next-line:triple-equals
                    if (status == SigninStatus.Success) {
                        this.succeed(result);
                    } else {
                        const message3 = ResourceManager.getString(
                            'msg_account_reactivated',
                        );
                        UIUtil.alertInfo(message3, null, () => {
                            this.succeed(result);
                        });
                    }
                } else {
                    storage.setUser(null);
                    storage.setForms(null);
                    let msg: string;
                    switch (status) {
                        case SigninStatus.Fail:
                            msg = ResourceManager.getString('fail_authentication');
                            break;
                        case SigninStatus.WrongPassword:
                            msg = ResourceManager.getString('fail_wrong_password');
                            break;
                        case SigninStatus.PasswordExpired:
                            msg = ResourceManager.getString('fail_password_expired');
                            break;
                        case SigninStatus.Suspended:
                            msg = ResourceManager.getString('fail_suspended_account');
                            break;
                        default:
                            msg = ResourceManager.getString('fail_authentication');
                            break;
                    }
                    this.showDanger(msg);
                }
            }, this.handleError);
    }

    render() {
        return (
            <SignInSide onSignIn={this.signin} _this={this}/>
        );
    }
}
