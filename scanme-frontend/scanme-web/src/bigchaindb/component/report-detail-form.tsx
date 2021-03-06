import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Card,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    Grid, Paper,
    Tooltip,
    Typography
} from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import L from 'leaflet';
import applicationContext from '../config/ApplicationContext';
import * as React from 'react';
import * as moment from 'moment';
import {storage} from '../../common/storage';
import * as qs from 'query-string';
const axios = require('axios');
import config from '../../config';
import './report-detail-form.scss';
export default class ReportDetailForm extends React.Component<any, any> {
    private readonly supplyChainService = applicationContext.getSupplyChainService();
    constructor(props) {
        super(props);
        const queryParam = qs.parse(props.props.location.search);
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 5,
            filterByProductIdData: [],
            geoLocations: [],
            isFinishLoading: {},
            isFinishLoadingCountLocation: {},
            isLoading: true,
            selectedFromDate: queryParam['from'] && new Date(queryParam['from'] as string) || new Date('01-01-' + new Date().getFullYear()),
            selectedToDate: queryParam['to'] && new Date(queryParam['to'] as string)  || new Date('12-31-' + new Date().getFullYear())
        };
    }

    componentDidMount(): void {
        this.initData();
    }

    getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color.toUpperCase() !== '#FF0000' ? color : this.getRandomColor(); // avoid the warning red color
    }

    groupBy = (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    createData = (transactions: any[]): any[] => {
        const displayData = [];
        transactions.forEach((tx, idx) => {
            displayData.push([
                moment(tx.scanDate).format('MM/DD/YYYY, h:mm:ss a'),
                !this.state.isFinishLoading[idx] && '??ang x??c ?????nh ?????a ch???...' || tx.locationName === 'Not found' ? tx.scanLocation.join(', ') : tx.locationName,
                tx.itemId,
                tx.transactionId,
                !this.state.isFinishLoadingCountLocation[idx] && '??ang t??nh to??n...' || tx.countLocationOfProductByTxId
            ]);
        });
        return displayData;
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        const columns = ['Ng??y qu??t', '?????a ch???', 'Item ID', 'Transaction ID (TxID)', 'S??? l???n qu??t d???a tr??n TxID'];
        const options = {
            filterType: 'multiselect',
            selectableRowsOnClick: true,
            // resizableColumns: true,
            elevation: 4,
            caseSensitive: false,
            responsive: 'scrollMaxHeight',
            rowsPerPage: 10,
            rowsPerPageOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
            searchPlaceholder: 'T??m',
            fixedHeaderOptions: {
                xAxis: false,
                yAxis: true
            },
            selectableRowsHeader: false,
            selectableRows: 'none',
            serverSide: false,
            setRowProps: (row) => {
                return {
                    className: Number.isNaN(row[4]) ? '' : row[4] >= 5 ? 'warning-scan-limit-row' : ''
                };
            },
            textLabels: {
                body: {
                    noMatch: 'Xin l???i, kh??ng t??m th???y d??? li???u',
                    toolTip: 'S???p x???p',
                    columnHeaderTooltip: column => `S???p x???p cho ${column.label}`
                },
                pagination: {
                    next: 'Trang k???',
                    previous: 'Trang tr?????c',
                    rowsPerPage: 'S??? d??ng',
                    displayRows: 'tr??n t???ng s???',
                },
                toolbar: {
                    search: 'T??m ki???m',
                    downloadCsv: 'T???i CSV',
                    print: 'In',
                    viewColumns: '???n/Hi???n c???t',
                    filterTable: 'L???c b???ng',
                },
            }
        };
        return (
            <>
                <CssBaseline/>
                <Container maxWidth='xl'>
                    <header>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Tooltip title='More Asset Information' placement='right'>
                                    <Typography variant='h4' align='left' component='h4'>
                                        B??o c??o chi ti???t
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </header>
                        <Grid container justify='flex-start' alignItems='flex-start' spacing={2} style={{marginTop: 16}}>
                            <Grid item xs={12}>
                                <Paper elevation={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography>S???n ph???m: {this.state.filterByProductIdData[0] && this.state.filterByProductIdData[0]['productName'] || ''}</Typography>
                                            <Typography>Ng??y b???t ?????u - Ng??y k???t th??c: {`${moment(this.state.selectedFromDate).format('DD/MM/YYYY')} - ${moment(this.state.selectedToDate).format('DD/MM/YYYY')}`}</Typography>
                                            <Typography>T???ng s??? l???n qu??t: {this.state.filterByProductIdData.length}</Typography>
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                                <Paper elevation={4}>
                                    <MUIDataTable
                                        title={<Typography
                                            component='div'
                                            style={{fontSize: 16, fontWeight: 500, color: '#263238', letterSpacing: -0.05}}>
                                            Ph??n t??ch truy xu???t
                                            {this.state.isLoading &&
                                            <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                                        </Typography>}
                                        rowsPerPage={20}
                                        className='report-detail-table'
                                        data={this.createData(this.state.filterByProductIdData)}
                                        columns={columns}
                                        options={options}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <Card>
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
                                                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>'
                                                url='https://api.mapbox.com/styles/v1/tqdanh/cl3ny9cba001j15mmvbw3x67v/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHFkYW5oIiwiYSI6ImNsM254aDY4ajAyOG0zanAxdmg3MmFybDIifQ.mm5g3BEMeR1hV1c5M6sjlg'
                                            />
                                            {this.state.filterByProductIdData.map((item: any, idx) => {
                                                return (
                                                    <Marker
                                                        icon={L.divIcon({
                                                            html: `<div class=\'my-div-icon\' style='background: ${Number.isNaN(item.countLocationOfProductByTxId) ? this.state.productColor : item.countLocationOfProductByTxId >= 5 ? 'red' : this.state.productColor}'></div>`
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
                        </Grid>
                </Container>
            </>
        );
    }

     private initData() {
        const orgId = storage.getProviderIdOfUser();
        this.supplyChainService
            .getLocationProductsByOrgId(orgId, moment(this.state.selectedFromDate).format('YYYY-MM-DD'), moment(this.state.selectedToDate).format('YYYY-MM-DD'))
            .subscribe(res => {
                if (res !== 'error' && Array.isArray(res) && res.length > 0) {
                    this.setState({
                        lat: res[0].scanLocation[0],
                        lng: res[0].scanLocation[1],
                        filterByProductIdData: this.groupBy(res, 'productId')[this.props.props.match.params.id] || [],
                        productColor: this.getRandomColor(),
                        isLoading: false
                    }, () => this.getRevereGeoLocation());
                }
            });
    }

    private async getRevereGeoLocation() {
        const delay = async interval => await new Promise(resolve => setTimeout(resolve, interval));
        const getLocationName = async item => {
            const url = `${config.reverseGeocodingService}?key=3bff9a643bcd6f&lat=${item.scanLocation[0]}&lon=${item.scanLocation[1]}&format=json`;
            return axios.get(url);
        };
        const getCountOfProductByTxId = async item => {
            const url = `${config.supplyChainServiceUrl}/countLocationProductsByTxId?transactionId=${item.transactionId}`;
            return axios.get(url);
        };
        let data: any;
        let temp_item: any;
        let new_item: any = {};
        let index = 0;
        const filteredData = this.state.filterByProductIdData;
        for (const item of filteredData) {
            await delay(100); // delay for prevent api service reject too many request at once
            await getLocationName(item).then(res => {
                temp_item = {...item,  locationName: res['data']['display_name']};
                new_item = {...temp_item};
                data = [...this.state.filterByProductIdData];
                data[index] = temp_item;
                this.setState({filterByProductIdData: data, isFinishLoading: {...this.state.isFinishLoading, [index]: true}});
            }, error => {
                temp_item = {...item,  locationName: 'Not found'};
                new_item = {...temp_item};
                data = [...this.state.filterByProductIdData];
                data[index] = temp_item;
                this.setState({filterByProductIdData: data, isFinishLoading: {...this.state.isFinishLoading, [index]: true}});
            });
            await getCountOfProductByTxId(new_item).then(res => {
                temp_item = {...new_item,  countLocationOfProductByTxId: res['data']};
                data = [...this.state.filterByProductIdData];
                data[index] = temp_item;
                this.setState({filterByProductIdData: data, isFinishLoadingCountLocation: {...this.state.isFinishLoadingCountLocation, [index]: true}});
            }, error => {
                temp_item = {...new_item,  countLocationOfProductByTxId: 0};
                data = [...this.state.filterByProductIdData];
                data[index] = temp_item;
                this.setState({filterByProductIdData: data, isFinishLoadingCountLocation: {...this.state.isFinishLoadingCountLocation, [index]: true}});
            });
            index++;
        }
    }
}
