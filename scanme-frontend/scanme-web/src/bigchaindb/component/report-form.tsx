import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    CssBaseline,
    Divider,
    Grid, Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@material-ui/core';
import L from 'leaflet';
import applicationContext from '../config/ApplicationContext';
import * as React from 'react';
import './report-form.scss';
import ProductChart from './pie-chart';
import {
    DatePicker,
    KeyboardDatePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as moment from 'moment';
import Search from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import {storage} from '../../common/storage';

export class ReportForm extends React.Component<any, any> {
    private trackingColors;
    private readonly supplyChainService = applicationContext.getSupplyChainService();

    constructor(props) {
        super(props);
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 5,
            productLocations: [],
            trackingColors: [],
            groupByProductIdData: [],
            selectedFromDate: new Date('01/01/' + new Date().getFullYear()),
            selectedToDate: new Date('12/31/' + new Date().getFullYear())
        };
        this.trackingColors = [];
    }

    componentDidMount(): void {
        this.initData();
        // const defaultIcon = L.icon({
        //   iconUrl: icon,
        //   shadowUrl: iconShadow
        // });
        // const defaultIcon = L.divIcon({className: 'my-div-icon'});
        // L.Marker.prototype.options.icon = myIcon;
    }

    setProductColor = () => {
        this.setState({
            trackingColors: Object.entries(this.state.groupByProductIdData).map(entry => ({
                productId: entry[0],
                color: this.getRandomColor(),
                productName: entry[1][0]['productName'] || ''
            }))
        });
    }

    getProductColor = (productId) => {
        const result = this.state.trackingColors.find(item => item.productId === productId);
        return result && result.color || '#fff';
    }

    getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // hexToRgbA = (hex, a) => {
    //     let c;
    //     if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    //         c = hex.substring(1).split('');
    //         if (c.length === 3) {
    //             c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    //         }
    //         c = '0x' + c.join('');
    //         // tslint:disable-next-line: no-bitwise
    //         return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${a})`;
    //     }
    //     throw new Error('Bad Hex');
    // }

    groupBy = (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    calculatePercentByTwoDecimal = (each: number, total: number) => {
        return each / total * 100;
    }

    calculateChartData = () => {
        return this.state.trackingColors.map(item => ({
            productName: item['productName'],
            percent: Math.round(this.calculatePercentByTwoDecimal(this.state.groupByProductIdData[item['productId']].length, this.state.productLocations.length) * 100) / 100,
            color: item['color']
        }));
    }
    createChartData = () => {
        const rawData = this.calculateChartData();
        const data = {
            datasets: [
                {
                    data: rawData.map(item => item.percent),
                    backgroundColor: rawData.map(item => item.color),
                    borderWidth: 1,
                    borderColor: '#fff',
                    hoverBorderColor: '#fff',
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }
            ],
            labels: rawData.map(item => item.productName)
        };
        return data;
    }
    generateNewColor = () => {
        this.setProductColor();
    }

    handleFromDateChange = (date) => {
        this.setState({selectedFromDate: date});
    }
    handleToDateChange = (date) => {
        this.setState({selectedToDate: date});
    }

    findProductLocations = () => {
        this.initData();
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        const data = this.createChartData();
        const {selectedFromDate, selectedToDate} = this.state;
        const startDate = moment(this.state.selectedFromDate).format('YYYY-MM-DD');
        const endDate = moment(this.state.selectedToDate).format('YYYY-MM-DD');
        return (
            <>
                <header className={'report-header'}>
                    <Typography variant='h4' align='left' component='h4'>
                        Vị trí sản phẩm khách hàng truy xuất
                    </Typography>
                </header>
                <Paper elevation={4} style={{padding: 16}}>
                    <Grid container justify='center' alignItems='center' spacing={2} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid item md={4} xs={12}>
                                <KeyboardDatePicker
                                    autoOk
                                    disableToolbar
                                    variant='inline'
                                    format='MM/dd/yyyy'
                                    id='start-date'
                                    label='Ngày bắt đầu'
                                    value={selectedFromDate}
                                    onChange={this.handleFromDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <KeyboardDatePicker
                                    autoOk
                                    disableToolbar
                                    variant='inline'
                                    format='MM/dd/yyyy'
                                    id='end-date'
                                    label='Ngày kết thúc'
                                    value={selectedToDate}
                                    onChange={this.handleToDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <Button variant='contained' size='small' color='primary'
                                        onClick={this.findProductLocations}>Thống kê &nbsp; <Search/></Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='left' component='span'>
                                    <InfoIcon/> {this.state.productLocations.length > 0 ? `Đã tìm thấy ${this.state.productLocations.length} vị trí` : 'Không tìm thấy vị trí'}
                                </Typography>
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Paper>
                <Grid container justify='center' alignItems='flex-start' spacing={2} style={{marginTop: 16}}>
                    <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                        <Card elevation={4}>
                            <div className='leaflet-container'>
                                <Map
                                    center={position}
                                    zoom={this.state.zoom}
                                    maxZoom={20}
                                    attributionControl={true}
                                    zoomControl={true}
                                    scrollWheelZoom={true}
                                    dragging={true}
                                    animate={true}
                                    easeLinearity={0.35}
                                >
                                    <TileLayer
                                        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                                        url='https://api.mapbox.com/styles/v1/tqdanh/cl3ny9cba001j15mmvbw3x67v/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHFkYW5oIiwiYSI6ImNsM254aDY4ajAyOG0zanAxdmg3MmFybDIifQ.mm5g3BEMeR1hV1c5M6sjlg'
                                    />
                                    {this.state.productLocations.map((item: any, idx) => {
                                        const color = this.getProductColor(item.productId);
                                        return (
                                            <Marker
                                                icon={L.divIcon({
                                                    html: `<div class=\'my-div-icon\' style='background: ${color}'></div>`
                                                })}
                                                key={`marker-${idx}`}
                                                position={item.scanLocation}
                                            >
                                                <Popup>
                                                    <span>{item['productName']}</span>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                                </Map>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card elevation={4} className='product-name-card'>
                                    <CardHeader
                                        title='Tên Sản Phẩm'
                                    />
                                    <Divider/>
                                    <CardContent className='product-name-card content'>
                                        <Grid container spacing={2}>
                                            {this.state.trackingColors.map((item, index) => <Grid key={index}
                                                                                                  item
                                                                                                  xs={6}>
                                                <div className='product-item'>
                                                    <div className='product-icon'
                                                         style={{background: item['color']}}/>
                                                    <Typography
                                                        component='span'>{item['productName']}</Typography>
                                                </div>
                                            </Grid>)}
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Table className='product-statistic'>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Tên Sản Phẩm</TableCell>
                                                            <TableCell align='right'>Số lần</TableCell>
                                                            <TableCell align='right'>Thao tác</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {Object.entries(this.state.groupByProductIdData).map((entry, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    {entry[1][0]['productName']}
                                                                </TableCell>
                                                                <TableCell
                                                                    align='right'>{(entry[1] as any).length}</TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={'Xem báo cáo'}>
                                                                        <IconButton
                                                                            style={{color: '#d74738'}}
                                                                            onClick={() => this.navigateToProductDetail(entry[0], startDate, endDate)}>
                                                                            <AssessmentIcon/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <Divider/>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <ProductChart generateNewColor={this.generateNewColor} title='Top Sản phẩm'
                                              data={data}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    }

    private initData() {
        const orgId = storage.getProviderIdOfUser();
        this.supplyChainService
            .getLocationProductsByOrgId(orgId, moment(this.state.selectedFromDate).format('YYYY-MM-DD'), moment(this.state.selectedToDate).format('YYYY-MM-DD'))
            .subscribe(res => {
                if (res !== 'error') {
                    if (Object.entries(res).length === 0 && res.constructor === Object) {
                        this.setState({ // reset to the default state
                            lat: 51.505,
                            lng: -0.09,
                            zoom: 5,
                            productLocations: [],
                            trackingColors: [],
                            groupByProductIdData: []
                        });
                    }
                    if (Array.isArray(res) && res.length > 0) {
                        this.setState({
                            productLocations: res,
                            lat: res[0].scanLocation[0],
                            lng: res[0].scanLocation[1],
                            groupByProductIdData: this.groupBy(res, 'productId'),
                        }, () => {
                            this.setProductColor();
                        });
                    }
                }
            });
    }

    private navigateToProductDetail(productId: string, startDate: string, endDate: string) {
        this.props.history.push(`report/product/${productId}?from=${startDate}&to=${endDate}`);
    }
}
