import * as React from 'react';
import {
    Button,
    Container,
    CssBaseline, Divider,
    Grid, Paper,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import config from '../../config';
const QRCode = require('qrcode.react');
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import './tracing-origin-form.scss';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import applicationContext from '../config/ApplicationContext';
import {NavLink} from 'react-router-dom';
export class TracingOriginForm extends React.Component<any, any> {
    private supplyChainService = applicationContext.getSupplyChainService();
    private exampleRef: any;
    constructor(props) {
        super(props);
        this.state = {
            inputTransactionId: '',
            searchValue: [],
            isLoading: true,
        };
        this.exampleRef = React.createRef();
    }

    componentDidMount(): void {
        const observable = fromEvent<any>(this.exampleRef.current, 'input'); // cold observable
        observable.pipe(
            map(event1 => event1.target.value),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            this.handleCallSearchAhead(value);
        });
    }
    handleCallSearchAhead(searchValue: string) {
        this.setState({isLoading: true});
        this.supplyChainService.getSearchTxIdByItemIdInList(searchValue).subscribe(res => {
            if (res !== 'error') {
                this.setState({searchValue: res, isLoading: false});
            }
        });
    }

    handleChangleInput = (event) => {
        const searchValue = event.target.value;
        this.setState({inputTransactionId: searchValue});
    }
    tracingOrigin = () => {
        this.props.history.push('/searchHistoryAssetByTransId?currentTransId=' + (this.state.searchValue[0] && this.state.searchValue[0].transactionId || this.state.inputTransactionId));
    }
    getURLString = (transactionValues: string) => {
        // const origin = window.location.origin;
        const origin = config.qrcodeBaseUrl;
        const pathName = '/getHisAssetByTransId';
        const searchString = `?currentTransId=${transactionValues}`;
        return `${origin}${pathName}${searchString}`;
    }
    render() {
        return (
            <>
                <CssBaseline/>
                <Container style={{height: '100%'}} maxWidth='lg'>
                    <Paper style={{height: '100%', padding: 8}} elevation={4}>
                        <header>
                            {/*<Grid container spacing={4}>*/}
                            {/*    <Grid item xs={12}>*/}
                            {/*        <Tooltip title='Truy xu???t ngu???n g???c'>*/}
                            {/*            <Typography variant='h4' align='center' component='h4'>*/}
                            {/*                Truy xu???t ngu???n g???c*/}
                            {/*            </Typography>*/}
                            {/*        </Tooltip>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                            {/*<Divider/>*/}
                        </header>
                        <Grid container style={{marginTop: 100}} justify='center' alignItems='center' spacing={2}>
                            <Grid item xs={12}>
                                {this.state.searchValue[0] && this.state.searchValue[0].transactionId || this.state.inputTransactionId && <QRCode
                                    id='qr-code'
                                    className='qrcode2'
                                    value={this.getURLString((this.state.searchValue[0] && this.state.searchValue[0].transactionId || this.state.inputTransactionId))}
                                    size={176}
                                    bgColor={'#fff'}
                                    fgColor={'#000'}
                                    level={'L'}
                                    includeMargin={true}
                                    renderAs={'canvas'}
                                    style={{
                                        display: 'block',
                                        margin: '0 auto',
                                        border: '1px solid #e0e0e0',
                                        padding: 8
                                    }}
                                    title='Transaction tracing link'
                                />}
                            </Grid>
                            <Grid item xs={12}>
                                <form onSubmit={() => this.tracingOrigin()}
                                      autoComplete={'off'}>
                                    <TextField
                                        id='input-transaction-id'
                                        className='search-tx-itemId'
                                        style={{padding: 16, paddingTop: 32, borderRadius: 30}}
                                        placeholder='Nh???p m?? truy xu???t, m?? m???t h??ng'
                                        fullWidth
                                        value={this.state.inputTransactionId}
                                        margin='normal'
                                        onChange={this.handleChangleInput}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                        variant={'outlined'}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <SearchIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputRef={this.exampleRef}
                                    />
                                    <Grid container justify='center'>
                                        <Button onClick={() => this.tracingOrigin()}
                                                type='submit' variant='outlined'
                                                size='small' color='primary'>Truy xu???t</Button>
                                    </Grid>
                                </form>
                            </Grid>
                            <Grid item xs={12}>
                                {!this.state.isLoading && <Typography>Tra c???u theo m?? m???t h??ng:</Typography>}
                                {!this.state.isLoading && this.state.searchValue.length <= 0 && <Typography>Kh??ng c?? k???t qu???</Typography>}
                                {!this.state.isLoading && this.state.searchValue.length > 0 &&
                                <React.Fragment> <Typography>C?? <strong>{this.state.searchValue.length}</strong> k???t qu???:</Typography>
                                    <nav>
                                        {this.state.searchValue.map(item => (
                                                <Typography style={{paddingBottom: 8}}>
                                                    <Typography><strong>M?? m???t h??ng:</strong> {item.itemId}</Typography>
                                                    <NavLink to={`/searchHistoryAssetByTransId?currentTransId=${item.transactionId}`}>
                                                        <strong>M?? giao d???ch:</strong> {item.transactionId}
                                                    </NavLink>
                                                    <Divider/>
                                                </Typography>
                                        ))}
                                    </nav>
                                </React.Fragment>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </>
        );
    }
}
