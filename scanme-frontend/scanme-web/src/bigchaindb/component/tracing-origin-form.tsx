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
                            {/*        <Tooltip title='Truy xuất nguồn gốc'>*/}
                            {/*            <Typography variant='h4' align='center' component='h4'>*/}
                            {/*                Truy xuất nguồn gốc*/}
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
                                        placeholder='Nhập mã truy xuất, mã mặt hàng'
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
                                                size='small' color='primary'>Truy xuất</Button>
                                    </Grid>
                                </form>
                            </Grid>
                            <Grid item xs={12}>
                                {!this.state.isLoading && <Typography>Tra cứu theo mã mặt hàng:</Typography>}
                                {!this.state.isLoading && this.state.searchValue.length <= 0 && <Typography>Không có kết quả</Typography>}
                                {!this.state.isLoading && this.state.searchValue.length > 0 &&
                                <React.Fragment> <Typography>Có <strong>{this.state.searchValue.length}</strong> kết quả:</Typography>
                                    <nav>
                                        {this.state.searchValue.map(item => (
                                                <Typography style={{paddingBottom: 8}}>
                                                    <Typography><strong>Mã mặt hàng:</strong> {item.itemId}</Typography>
                                                    <NavLink to={`/searchHistoryAssetByTransId?currentTransId=${item.transactionId}`}>
                                                        <strong>Mã giao dịch:</strong> {item.transactionId}
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
