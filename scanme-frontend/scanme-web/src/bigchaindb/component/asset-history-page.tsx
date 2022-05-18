import AccessTimeIcon from '@material-ui/icons/AccessTime';
import BusinessIcon from '@material-ui/icons/Business';
import 'react-vertical-timeline-component/style.min.css';
import MarkerIcon from '@material-ui/icons/Room';
import {
    BottomNavigation,
    BottomNavigationAction,
    Card,
    CardActions,
    CardContent,
    CardHeader, CircularProgress,
    Collapse,
    CssBaseline,
    Grid,
    IconButton, Tooltip,
    Typography
} from '@material-ui/core';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import * as React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import './asset-history-form.scss';
import applicationContext from '../config/ApplicationContext';
import * as qs from 'query-string';
import {ResourceManager} from '../../common/ResourceManager';
import InfoIcon from '@material-ui/icons/Info';
import ArrowIcon from '@material-ui/icons/ArrowUpwardOutlined';
import EditIcon from '@material-ui/icons/Edit';
const QRCode = require('qrcode.react');
import * as moment from 'moment';
import config from '../../config';

moment.locale('vi');

export class AssetHistoryPage extends React.Component<any, any> {
    private readonly supplyChainService = applicationContext.getSupplyChainService();
    private isDesktopMode = false;
    constructor(props) {
        super(props);
        console.log('props', props);
        this.isDesktopMode = this.props.props.match.path === '/searchHistoryAssetByTransId';
        const queryParam = qs.parse(props.props.location.search);
        this.state = {
            expandCards: {},
            transactionId: queryParam['currentTransId'] || '',
            historyList: [],
            productLine: '',
            loading: true,
            error: false
        };

    }

    getProductLineName = (historyList: any[]) => {
        const entries = Object.entries(historyList);
        const entriesLength = entries.length;
        const lastProviderItem = entries[entriesLength - 1];
        const lastProviderItemValue = lastProviderItem[1];
        const length = lastProviderItemValue.length;
        const lastContent = lastProviderItemValue[length - 1];
        return lastContent.contents.productLine;
    }

    componentDidMount(): void {
        const {transactionId} = this.state;
        if (transactionId) {
            this.supplyChainService.viewHistory(transactionId).subscribe(result => {
                    if (result !== 'error') {
                        this.setState({
                            historyList: result,
                            productLine: this.getProductLineName(result),
                            loading: false
                        });
                    } else {
                        this.setState({error: true, loading: false});
                    }
                }
            );
        }
    }

    onNavigateToOtherTransactionHistory = (transactionId) => {
        this.props.history.push({
            pathname: window.location.pathname,
            search: `?currentTransId=${transactionId}`
        });
    }

    // formatName(str) {
    //   const formatedStr = str.replace(/_/g, ' ');
    //   return formatedStr.split(' ').map((word) => {
    //     const temp = word.charAt(0).toUpperCase() + word.slice(1);
    //     return temp.split(/(?=[A-Z])/).join(' ');
    //   }).join(' ');
    // }

    // formatDate(dateStr) {
    //   const date = new Date(dateStr);
    //   const minutes = date.getMinutes();
    //   const day = date.getDate();
    //   const month = date.getMonth();
    //   return `${month > 9 ? month + 1 : '0' + (month + 1)}/${day > 9 ? day : '0' + day}/${date.getFullYear()} ${date.getHours()}:${minutes > 9 ? minutes : '0' + minutes}`;
    // }

    MarkerIcon = () => {
        return (
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
                <path
                    fill='#fff'
                    d='M12 1028.4a8 8 0 00-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 1052.4l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0020 1036.4a8 8 0 00-8-8zm0 4a4 4 0 110 8 4 4 0 010-8z'
                    transform='translate(0 -1028.4)'
                />
                <path
                    fill='#2196f3'
                    d='M12 1031.4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z'
                    transform='translate(0 -1028.4)'
                />
            </svg>
        );
    }

    getKeyOfProvider = (provider: any): any => {
        return Object.keys(provider)[0];
    }
    getContentsOfProvider = (provider: any): any => {
        return Object.values(provider)[0];
    }

    getContentOfProviderByIndex = (provider: any, index): any => {
        return Object.values(provider)[0][index];
    }

    handleExpandClick = (parentIndex, childIndex) => {
        this.setState(prevState => {
            const cloneExpandCards = {...prevState.expandCards};
            cloneExpandCards['parent-' + parentIndex + '-' + childIndex] = !cloneExpandCards['parent-' + parentIndex + '-' + childIndex];
            return {expandCards: cloneExpandCards};
        });
    }

    handleOnClickSource = (event, id) => {
        event.preventDefault();
        this.onNavigateToOtherTransactionHistory(id);
    }

    onNavigateBack = () => {
        this.props.history.goBack();
    }

    getURLString = (transactionValues: string) => {
        // const origin = window.location.origin;
        const origin = config.qrcodeBaseUrl;
        const pathName = '/getHisAssetByTransId';
        const searchString = `?currentTransId=${transactionValues}`;
        return `${origin}${pathName}${searchString}`;
    }

    convertCamelToSentenceCase = (replacedText: string) => {
        const result = replacedText.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    handleEditTransaction = (event, transactionId) => {
        event.preventDefault();
        this.props.history.push(`/search?txId=${transactionId}`);
    }

    render() {
        const {historyList, transactionId} = this.state;
        let history: any;
        const historyListArray = Object.keys(historyList).map((key) => {
            history = {};
            history[key] = historyList[key];
            return history;
        });
        const resource = ResourceManager.getResource();
        return (
            <>
                <CssBaseline/>
                {this.state.loading && <CircularProgress/>}
                {this.state.error && `${resource.no_histories_found}: ${transactionId || 'null'}`}
                {Object.entries(this.state.historyList).length > 0 && <React.Fragment>
                    <div className='tracing-container' style={{padding: 0}}>
                        <Grid container alignItems='flex-start' spacing={4}>
                            <Grid item xs={12}>
                                <Card className='tracing-card-info'>
                                    <CardHeader style={{background: '#2196f3'}}
                                                title={
                                                    <React.Fragment>
                                                        <div style={{display: 'flex'}}>
                                                            <QRCode
                                                                id='qr-code'
                                                                className='qrcode1'
                                                                value={this.getURLString(transactionId || '')}
                                                                size={96}
                                                                bgColor={'#fff'}
                                                                fgColor={'#000'}
                                                                level={'L'}
                                                                includeMargin={true}
                                                                renderAs={'canvas'}
                                                            />
                                                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                                                                <Typography component='p' style={{
                                                                    marginLeft: 16
                                                                }}>{resource.trans_tracing_code}: {transactionId || ''}</Typography>
                                                                <Typography component='p' style={{
                                                                    marginLeft: 16
                                                                }}>{resource.product_line}: {this.state.productLine || ''}</Typography>
                                                                {/*<Typography onClick={(event) => this.handleEditTransaction(event, transactionId)}>*/}
                                                                {/*    <EditIcon style={{fontSize: 16}}/>*/}
                                                                {/*</Typography>*/}
                                                           {!this.isDesktopMode && <Tooltip title={'Thêm thông tin'}>
                                                                    <Typography style={{fontSize: 32, marginLeft: 16}} onClick={(event) => this.handleEditTransaction(event, transactionId)} component={'span'}>
                                                                    ...<EditIcon/>
                                                                    </Typography>
                                                                </Tooltip>}
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                }/>
                                </Card>
                            </Grid>
                        </Grid>
                        <VerticalTimeline>
                            {historyListArray.map((provider, index) => <VerticalTimelineElement
                                key={index}
                                contentArrowStyle={{borderRight: '7px solid  rgb(33, 150, 243)'}}
                                className='vertical-timeline-element--provider-address'
                                iconStyle={{background: 'rgb(33, 150, 243)', color: '#fff'}}
                                icon={this.MarkerIcon()}
                            >
                                {/* parent header */}
                                <section className='provider-header'>
                                    <Typography className='vertical-timeline-element-title' color='primary'
                                                variant='h5'><BusinessIcon
                                        style={{color: '#FF5722', marginRight: 8}}/> {this.getKeyOfProvider(provider)}
                                    </Typography>
                                    <Typography className='vertical-timeline-element-subtitle' color='initial'
                                                variant='h6'>
                                        <MarkerIcon style={{color: '#03A9F4', marginRight: 8}}/>
                                        {this.getContentsOfProvider(provider).length > 0 ? this.getContentOfProviderByIndex(provider, 0).providerAddress : ''}
                                    </Typography>
                                </section>

                                {/* contents */}
                                {this.getContentsOfProvider(provider).map((info, i) => <React.Fragment key={i}> <Card
                                    className='content-card'
                                    style={{marginTop: 8}}>
                                    <CardHeader className='child-card-header' title={
                                        <Typography className='child-card-header title' color='initial'>
                                            <InfoIcon style={{color: '#03A9F4', marginRight: 8}}/>
                                            {info.noteAction === 'Divide asset' ? 'Phân chia asset' : info.noteAction}
                                            <IconButton
                                                style={{
                                                    display: 'inline',
                                                    marginLeft: 8,
                                                    outline: 'none',
                                                    color: '#fff'
                                                }}
                                                onClick={() => this.handleExpandClick(index, i)}
                                                aria-expanded={this.state.expandCards['parent-' + index + '-' + i]}
                                                aria-label='show more'
                                            >
                                                <ExpandMoreIcon
                                                    style={{color: '#000'}}
                                                    className={this.state.expandCards['parent-' + index + '-' + i] ? '' : 'collapse-icon'}/>
                                            </IconButton>
                                        </Typography>
                                    }/>
                                    <Collapse in={!this.state.expandCards['parent-' + index + '-' + i]} timeout='auto'
                                              unmountOnExit>
                                        <CardContent className='child-card-content'>
                                            <ul className='child-card-content list'>
                                                {info.noteAction !== 'Divide asset' && Object.entries(info.contents).map((entry, i1) =>
                                                    <li key={i1}><Typography
                                                        className='child-card-content content-text'>{entry[0] + ': ' + entry[1]}</Typography>
                                                    </li>)}
                                            </ul>
                                            {info.noteAction === 'Divide asset' && Object.entries(info.contents).map((entry, i1) =>
                                                <TreeView
                                                    key={i1}
                                                    defaultCollapseIcon={<ExpandMoreIcon/>}
                                                    defaultExpandIcon={<ChevronRightIcon/>}
                                                >
                                                    <TreeItem nodeId={`'Asset ' + ${entry[0]}`}
                                                              label={`${resource.asset_index} ${entry[0]}`}>
                                                        {Object.entries(entry[1]).map((divideDataEntry, i2) => <TreeItem
                                                            key={i2} nodeId={`${entry[0]}-child-${i2}`}
                                                            label={this.convertCamelToSentenceCase(divideDataEntry[0]) + ': ' + divideDataEntry[1]}/>)}
                                                    </TreeItem>
                                                </TreeView>)}

                                            {info.sources && <React.Fragment>
                                                <Typography
                                                    onClick={() => this.handleOnClickSource(event, info.sources[0].transactionId)}
                                                    className='child-card-content content-text sources'>
                                                    <ShoppingCartIcon style={{color: '#E57373', marginRight: 8}}/>
                                                    <a style={{color: '#263238'}}
                                                       href='#'>{'Source: ' + info.sources[0].productLine}</a>
                                                </Typography>
                                            </React.Fragment>}
                                        </CardContent>
                                    </Collapse>
                                    <CardActions className='child-card-actions'>
                                        <Typography className='child-card-actions action-text time-stamp'>
                                            <AccessTimeIcon style={{color: '#009688', marginRight: 8}}/>
                                            Ngày tạo: &nbsp;
                                            {moment(info.timeStamp).format('MM/DD/YYYY, h:mm:ss a')}
                                        </Typography>
                                    </CardActions>

                                </Card> {i !== this.getContentsOfProvider(provider).length - 1 &&
                                <ArrowIcon style={{fontSize: 40, color: '#37474F', marginTop: 8}}/>}</React.Fragment>)}

                            </VerticalTimelineElement>)}
                        </VerticalTimeline>
                    </div>
                    <BottomNavigation className='timestamp-bottom-navigate'
                                      showLabels
                    >
                        <BottomNavigationAction disabled={false} onClick={this.onNavigateBack} label={resource.back}
                                                icon={<ArrowBackIcon/>}/>
                    </BottomNavigation>
                </React.Fragment>}
            </>
        );
    }
}
