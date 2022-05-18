import AccessTimeIcon from '@material-ui/icons/AccessTime';
import BusinessIcon from '@material-ui/icons/Business';
import 'react-vertical-timeline-component/style.min.css';
import ClearIcon from '@material-ui/icons/Clear';
import MarkerIcon from '@material-ui/icons/Room';
import {
    BottomNavigation,
    BottomNavigationAction,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    CssBaseline,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from '@material-ui/core';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import InfoIcon from '@material-ui/icons/Info';
import * as React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import './asset-history-form.scss';
import {ResourceManager} from '../../common/ResourceManager';
import * as moment from 'moment';
import ArrowIcon from '@material-ui/icons/ArrowUpwardOutlined';
import config from '../../config';

const QRCode = require('qrcode.react');
let _this: any;

export class AssetHistoryModal extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            expandCards: {},
            firstTransactionHistory: this.props.transactionId || '',
            productLine: this.props.productLine || ''
        };
        _this = this;

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
        this.props.handleNavigateToOtherTransactionHistory(id);
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

    onNavigateBack = () => {
        if (_this.props.history) {
            _this.props.history.goBack();
        }
    }
    onNavigateFirstTrans = () => {
        this.props.navigateToFirstTransaction(this.state.firstTransactionHistory);
    }

    render() {
        const {historyList, transactionId} = this.props;
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
                <header
                    style={{
                        width: '100%',
                        height: 50,
                        background: '#2979ff',
                        color: '#fff',
                        paddingLeft: 16
                    }}
                >
                    <Grid container justify={'space-between'}>
                        <Grid item style={{margin: 'auto'}}>
                            <Tooltip title='More Asset Information' placement='right'>
                                <Typography style={{color: '#fff'}} variant='h4' align='left' component='h4'>
                                    {resource.tracing_origin}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip style={{color: 'inherit'}} title='Close'>
                                <IconButton onClick={() => this.props.closeModal(1)}>
                                    <ClearIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </header>

                <div className='tracing-container'>
                    <Grid container alignItems='flex-start' spacing={4}>
                        <Grid item xs={12}>
                            <Card className='tracing-card-info'>
                                <CardHeader style={{background: '#2196f3'}}
                                            title={
                                                <>
                                                    <div style={{display: 'flex'}}>
                                                        <QRCode
                                                            id='qr-code'
                                                            className='qrcode2'
                                                            value={this.getURLString(transactionId || '')}
                                                            size={96}
                                                            bgColor={'#fff'}
                                                            fgColor={'#000'}
                                                            level={'L'}
                                                            includeMargin={true}
                                                            renderAs={'canvas'}
                                                        />
                                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                                            <Typography component='p' style={{
                                                                marginLeft: 16
                                                            }}>{resource.trans_tracing_code}: {transactionId || ''}</Typography>
                                                            <Typography component='p' style={{
                                                                marginLeft: 16
                                                            }}>{resource.product_line}: {this.state.productLine || ''}</Typography>
                                                        </div>
                                                    </div>
                                                </>
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
                                    style={{color: '#F44336', marginRight: 8}}/> {this.getKeyOfProvider(provider)}
                                </Typography>
                                <Typography className='vertical-timeline-element-subtitle' color='initial' variant='h6'>
                                    <MarkerIcon style={{color: '#03A9F4', marginRight: 8}}/>
                                    {this.getContentsOfProvider(provider).length > 0 ? this.getContentOfProviderByIndex(provider, 0).providerAddress : ''}
                                </Typography>
                            </section>

                            {/* contents */}
                            {this.getContentsOfProvider(provider).map((info, i) => <div key={i}><Card key={i}
                                                                                                      className='content-card'
                                                                                                      style={{marginTop: 16}}>
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
                                                <TreeItem nodeId={`'Asset' + ${entry[0]}`}
                                                          label={`${resource.asset_index} ${entry[0]}`}>
                                                    {Object.entries(entry[1]).map((divideDataEntry, i2) => <TreeItem
                                                        key={i2} nodeId={`${entry[0]}-child-${i2}`}
                                                        label={this.convertCamelToSentenceCase(divideDataEntry[0]) + ': ' + divideDataEntry[1]}/>)}
                                                </TreeItem>
                                            </TreeView>)}

                                        {info.sources && info.sources.map((source, i3) => <React.Fragment key={i3}>
                                            <Typography
                                                onClick={() => this.handleOnClickSource(event, source.transactionId)}
                                                className='child-card-content content-text sources'>
                                                <ShoppingCartIcon style={{color: '#E57373', marginRight: 8}}/>
                                                <a style={{color: '#263238'}}
                                                   href='#'>{'Source: ' + source.productLine}</a>
                                            </Typography>
                                        </React.Fragment>)}
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
                            <ArrowIcon style={{fontSize: 40, color: '#37474F', marginTop: 8}}/>}</div>)}

                        </VerticalTimelineElement>)}
                    </VerticalTimeline>
                </div>
                {/*<BottomNavigation className='timestamp-bottom-navigate'*/}
                {/*                  showLabels*/}
                {/*>*/}
                {/*    <BottomNavigationAction disabled={false} onClick={this.onNavigateBack} label={resource.back}*/}
                {/*                            icon={<ArrowBackIcon/>}/>*/}
                {/*</BottomNavigation>*/}
                <BottomNavigation className='timestamp-bottom-navigate'
                                  showLabels
                >
                    <BottomNavigationAction disabled={false} onClick={this.onNavigateFirstTrans}
                                            label={resource.go_to_first_trans} icon={<ArrowBackIcon/>}/>
                </BottomNavigation>
            </>
        );
    }
}
