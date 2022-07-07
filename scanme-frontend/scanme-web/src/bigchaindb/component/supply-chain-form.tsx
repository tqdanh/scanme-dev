import AddIcon from '@material-ui/icons/Add';
import {DivideModal} from './divide-form';
import {HistoryProps} from '../../common/component/HistoryProps';
import {SearchComponent} from '../../common/component/SearchComponent';
import {SearchState} from '../../common/component/SearchState';
import {UIUtil} from '../../common/util/UIUtil';
import applicationContext from '../config/ApplicationContext';
import {SupplyChain} from '../model/SupplyChain';
import {SupplyChainSM} from '../search-model/SupplyChainSM';
import * as React from 'react';
import {AddMetaModal} from './add-metadata-form';
import {AddNewModal} from './create-asset-form';
import {
    Backdrop,
    Button,
    CircularProgress,
    CssBaseline,
    Fade, FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid,
    Paper, RadioGroup,
    Tooltip,
    Typography
} from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import {AssetHistoryModal} from './asset-history-modal';
import Search from '@material-ui/icons/Search';
import {TransferForm} from './transfer-form';
import IconButton from '@material-ui/core/IconButton';
import HistoryIcon from '@material-ui/icons/History';
import EditIcon from '@material-ui/icons/Edit';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import './supply-chain-form.scss';
import './common/style.scss';
import {ResourceManager} from '../../common/ResourceManager';
import {Modal as MatModal} from '@material-ui/core/';
import {Field, Form} from 'react-final-form';
import {Radio, TextField} from 'final-form-material-ui';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const QRCode = require('qrcode.react');
import * as moment from 'moment';
import config from '../../config';
import GetAppIcon from '@material-ui/icons/GetApp';
import readXlsxFile from 'read-excel-file';

interface Data {
    productLine: string;
    productDescription: string;
    createDate: Date;
    amount: number;
    assetID: string;
    txID: string;
}

export const commonModalStyle = {
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    paper: {
        backgroundColor: '#fff',
        boxShadow: '0px 10px 13px -6px rgba(0,0,0,0.2), 0px 20px 31px 3px rgba(0,0,0,0.14), 0px 8px 38px 7px rgba(0,0,0,0.12)',
        // padding: '0 0 24px',
        borderRadius: 3
    }
};
export const onDownloadQRCode = () => {
    const canvas: any = document.getElementById('qr-code');
    const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qr-code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};
export const getURLString = (transactionValues: string) => {
    // const origin = window.location.origin;
    const origin = config.qrcodeBaseUrl;
    const pathName = '/getHisAssetByTransId';
    const searchString = `?currentTransId=${transactionValues}`;
    return `${origin}${pathName}${searchString}`;
};
export const TransitionsModal = (props) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title={'View QR code'} className='btn-group-btn'>
                <IconButton onClick={handleOpen}>
                    <PhotoCameraIcon/>
                </IconButton>
            </Tooltip>
            <MatModal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                style={{...commonModalStyle.modal, textAlign: 'center'}}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div style={{...commonModalStyle.paper, width: 'unset', padding: '16px'}}>
                        <h2 id='transition-modal-title'>Link truy xuất</h2>
                        <QRCode
                            id='qr-code'
                            className='qrcode'
                            value={getURLString(props.value)}
                            size={192}
                            bgColor={'#00a2e8'}
                            fgColor={'#ffffff'}
                            level={'L'}
                            includeMargin={true}
                            renderAs={'canvas'}
                        />
                        <Button
                            onClick={props.downloadQRCode}
                            title={'Download QR code'}
                            size='small'
                            color='primary'
                            className='text-btn'
                            style={{textTransform: 'inherit', width: '40%'}}
                        >
                            <SaveIcon/> Lưu
                        </Button>
                    </div>
                </Fade>
            </MatModal>
        </div>
    );
};

let _this: any;

export class SupplyChainForm extends SearchComponent<SupplyChain, SupplyChainSM, HistoryProps, SearchState<SupplyChain>> {
    form: any;
    // the default value when form load and also on initData
    defaultValue = {
        productLine: '',
        productDescription: '',
        transactionId: '',
        amount: '',
        timeStamp: null,
        providerName: '',
        assetId: '',
        status: 'F'
    };
    private readonly supplyChainService = applicationContext.getSupplyChainService();
    private readonly itemService = applicationContext.getItemService();
    private inputExcel: any;
    private excelData: any[];

    constructor(props) {
        super(props, applicationContext.getSupplyChainService(), null);
        this.state = {
            results: [],
            histories: [],
            filterTransaction: {},
            transactionId: '',
            status: 'F',
            assetId: '',
            productLine: '',
            productDescription: '',
            amount: '',
            timeStamp: null,
            providerName: '',
            isOpenHistoryModal: false,
            isOpenTransferModal: false,
            isOpenDivideModal: false,
            isOpenAddNewModal: false,
            isOpenAddMetaModal: false,
            // table pagination state
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            itemTotal: this.itemTotal,
            isLoading: false,
            selectedProductLineName: '',
            divideTransactions: [],
            selectedOutputIndex: '',
            itemIdsByTransactionId: {}
        };
        _this = this;
        this.inputExcel = React.createRef();
    }

    handleReadExcelFile = async e => {
        e.stopPropagation();
        console.log('e', e.target);
        const input = e.target;
        if (!input) {
            return;
        }
        // input.value = '';
        // input.click();
        if (input.files && input.files.length > 0) {
            try {
                const rows = await readXlsxFile(input.files[0]);
                this.excelData = rows;
                this.excelData = this.excelData.slice(1);
                const body = this.excelData.map(row => ({
                    productLine: row[0],
                    productDescription: row[1],
                    quantity: row[2],
                    unit: row[3]
                }));
                const result = await this.supplyChainService.importCreateAsset(body).toPromise();
                if (result !== 'error') {
                    this.componentDidMount();
                    alert('Import excel success!');
                }
            } catch (err) {
                alert(err);
                this.excelData = undefined;
            } finally {
                input.value = '';
            }
        }
    }

    componentDidMount() {
        this.searchModelByPageIndexAndPageSize();
    }

    onSuccessOperation() {
        _this.searchModelByPageIndexAndPageSize();
    }

    searchModelByPageIndexAndPageSize(pageIndexP?: number, pageSizeP?: number) {
        this.setState({isLoading: true});
        const searchModel = this.getSearchModel();
        const pageIndex = pageIndexP || this.state.pageIndex;
        const pageSize = pageSizeP || this.state.pageSize;
        Object.assign(searchModel, {pageIndex, pageSize});
        this.supplyChainService.search(searchModel).subscribe((data) => {
            this.setState({
                results: data.results,
                itemTotal: data.itemTotal,
                isLoading: false,
                pageSize: searchModel.pageSize,
                pageIndex: searchModel.pageIndex
            }, () => {
                const transactionIds = [];
                this.state.results?.forEach(item => {
                    transactionIds.push(item.transactionId);
                });
                this.itemService.getSearchItemIdByTxId(transactionIds).subscribe(res => {
                    if (res !== 'error') {
                        if (res.length <= 0) {
                            return;
                        }
                        let normalizeData = {};
                        res.forEach(item => {
                            normalizeData = {...normalizeData, [item.transactionId]: item.itemId};
                        });
                        this.setState({
                            itemIdsByTransactionId: normalizeData
                        });
                    }
                });
            });
        });
    }

    handleChangeTable = (action, tableState) => {
        if (action === 'changeRowsPerPage') {
            this.setState({
                pageIndex: 1,
                pageSize: tableState.rowsPerPage,
                isLoading: true,
            }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex, this.state.pageSize));
        } else if (action === 'changePage') {
            this.setState({
                pageIndex: tableState.page + 1,
                isLoading: true,
            }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex));
        }
    }

    getSearchModel(): SupplyChainSM {
        const s = this.populateSearchModel();
        const {productLine, productDescription, transactionId, amount, timeStamp, providerName, assetId, pageIndex, pageSize} = this.state;
        Object.assign(s, {
            productLine,
            productDescription,
            transactionId,
            amount,
            timeStamp: timeStamp ? moment(timeStamp).format('YYYY-MM-DD') : null,
            spentStatus: this.handleStatus(),
            providerName,
            assetId,
            pageIndex,
            pageSize
        });
        return s;
    }

    handleStatus = () => {
        const {status} = this.state;
        let spentStatus: boolean;
        if (status === 'T') {
            spentStatus = true;
        } else {
            spentStatus = false;
        }
        return spentStatus;
    }

    openModal = (e, transactionId, index, ...rest) => {
        if (e) {
            e.preventDefault();
        }
        const resource = ResourceManager.getResource();
        if (index === 1) { // history
            this.supplyChainService.viewHistory(transactionId).subscribe(result => {
                this.setState({
                    filterTransaction: transactionId,
                    histories: result,
                    isOpenHistoryModal: true,
                    selectedProductLineName: rest[0]
                });
            });
        }
        if (index === 4) {
            this.setState({isOpenAddNewModal: true});
        }
        if (index === 2 || index === 3 || index === 5) { // transfer, divide, append modal
            this.supplyChainService.search({transactionId}).subscribe(res => {
                if (res !== 'error') {
                    this.setState({
                        filterTransaction: res.results[0],
                        selectedOutputIndex: rest[0],
                        divideTransactions: res.results, ...this.getDialogOpen(index)
                    });
                } else {
                    UIUtil.showToast(resource.error_search_tranx + transactionId);
                }
            });
        }
        if (index === 6) {
            this.supplyChainService.search({transactionId}).subscribe(res => {
                if (res !== 'error') {
                    this.setState({filterTransaction: res.results[0], selectedOutputIndex: rest[0]}, () => {
                        this.onHandleBurn(null, transactionId, rest[0]);
                    });
                } else {
                }
            });
        }
    }

    getDialogOpen(index: number) {
        if (index === 2) {
            return {isOpenTransferModal: true};
        } else if (index === 3) {
            return {isOpenDivideModal: true};
        } else {
            return {isOpenAddMetaModal: true};
        }
    }

    onHandleBurn = (e, transactionId, outputIndex: number) => {
        if (e) {
            e.preventDefault();
        }
        const filterTransaction = this.state.results.filter(transaction => transaction.transactionId === transactionId)[0];
        this.setState({filterTransaction}, () => {
            this.supplyChainService.burnAsset(this.state.filterTransaction.transactionId, outputIndex).subscribe((res) => {
                if (res !== 'error') {
                    this.onSuccessOperation();
                    window.alert('Burn success!');
                } else {
                }
            });
        });
    }

    closeModal = (index) => {
        if (index === 1) {
            this.setState({isOpenHistoryModal: false});
        }
        if (index === 2) {
            this.setState({isOpenTransferModal: false});
        }
        if (index === 3) {
            this.setState({isOpenDivideModal: false});
        }
        if (index === 4) {
            this.setState({isOpenAddNewModal: false});
        }
        if (index === 5) {
            this.setState({isOpenAddMetaModal: false});
        }
    }

    // handleRdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     this.setState({status: (event.target as HTMLInputElement).value});
    // }

    onChangePage = (currentPage: number) => {
        this.setState({
            pageIndex: currentPage + 1,
            isLoading: true,
        }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex));
    }

    onChangeRowsPerPage = (numberOfRows: number) => {
        this.setState({
            pageIndex: 1,
            pageSize: numberOfRows,
            isLoading: true,
        }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex, this.state.pageSize));
    }

    searchOnClick = (values) => {
        // the order {...this.defaultValue, ...values} !!!
        this.setState({...this.defaultValue, ...values, timeStamp: this.state.timeStamp}, () => { // because the timeStamp not managed by the react final form library
            const {pageSize} = this.state;
            this.searchModelByPageIndexAndPageSize(1, pageSize);
        });
    }

    clearFields = (form: any) => {
        // use additional state managed for api call for form
        this.setState({
            productLine: '',
            productDescription: '',
            transactionId: '',
            amount: '',
            timeStamp: null,
            providerName: '',
            assetId: '',
            status: 'F'
        });
        form.reset(); // only this line needed when reset the form
    }

    createData = (transactions: any[]): Data[] => {
        const displayData = [];
        transactions?.forEach((tx) => {
            displayData.push([
                tx.assetData.contents.productLine,
                tx.assetData.contents.productDescription,
                tx.assetData.providerName,
                moment(new Date(tx.assetData.timeStamp)).format('MM/DD/YYYY, h:mm:ss a'),
                tx.amount,
                tx.assetId,
                tx.transactionId,
                tx.outputIndex,
                this.state.itemIdsByTransactionId[tx.transactionId] || '-'
            ]);
        });
        return displayData;
    }

    onNavigateToOtherTransactionHistory = (transactionId) => {
        this.supplyChainService.viewHistory(transactionId).subscribe(result => {
            this.setState({
                filterTransaction: transactionId,
                histories: result,
                isOpenHistoryModal: true
            });
        });

    }


    confirmSubmit = () => {
    }
    validate = values => {
        const errors: any = {};
        if (!values.metaNoteAction) {
            errors.metaNoteAction = 'Required';
        }
        return {...errors};
    }

    render() {
        const resource = ResourceManager.getResource();
        const {
            status,
            timeStamp,
            itemTotal,
            pageIndex,
            pageSize,
            isLoading
        } = this.state;

        const options = {
            filterType: 'multiselect',
            selectableRowsOnClick: true,
            // resizableColumns: true,
            elevation: 4,
            caseSensitive: true,
            responsive: 'scrollMaxHeight',
            rowsPerPage: pageSize,
            rowsPerPageOptions: this.pageSizes,
            searchPlaceholder: 'Search transaction',
            fixedHeaderOptions: {
                xAxis: false,
                yAxis: true
            },
            selectableRowsHeader: false,
            selectableRows: 'none',
            // expandableRows: true,
            // expandableRowsOnClick: true,
            // customRowRender: (data, dataIndex, rowIndex) => {
            //     console.log(data);
            //     )
            // }
            // customToolbar: () => {
            //     return (
            //         <CustomToolbar />
            //     );
            // },
            // onRowClick: (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
            //     console.log('rowData', rowData);
            //     console.log('rowMeta', rowMeta);
            // },
            // onCellClick: (colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => {
            //     if (cellMeta.colIndex === 6) {
            //         this.openModal(null, colData, 1);
            //     }
            //     // console.log('colData', colData);
            //     // console.log('cellMeta', cellMeta);
            // },
            serverSide: true,
            count: itemTotal, // total Count for page index
            page: pageIndex - 1, // pageIndex
            onTableChange: (action, tableState) => {
                this.handleChangeTable(action, tableState);
            },
            // onChangePage: this.onChangePage,
            // onChangeRowsPerPage: this.onChangeRowsPerPage,
            // filterList: [
            //     ['Hạt giống sâm Ngọc Linh 10'],
            //     [],
            //     [],
            //     [],
            //     []
            // ],
            // searchText: this.state.searchText,
            // searchPlaceholder: 'Your Custom Search Placeholder',
            // customSearch: (searchQuery, currentRow, columns) => {
            //   let isFound = false;
            //   currentRow.forEach(col => {
            //     if (col.toString().indexOf(searchQuery) >= 0) {
            //       isFound = true;
            //     }
            //   });
            //   return isFound;
            // },
            // onFilterDialogOpen: () => {
            //     console.log('filter dialog opened');
            // },
            // onFilterChange: (column, filterList) => {
            //     console.log('updating filters via chip');
            //     //   this.handleFilterSubmit(filterList)();
            // },
            // customFilterDialogFooter: filterList => {
            //     return (
            //         <div style={{ marginTop: '40px' }}>
            //             <Button variant='contained'>Apply Filters*</Button>
            //             <p><em>*(Simulates selecting "Chicago" from "Location")</em></p>
            //         </div>
            //     );
            // }
            textLabels: {
                body: {
                    noMatch: 'Xin lỗi, không tìm thấy dữ liệu',
                    toolTip: 'Sắp xếp',
                    columnHeaderTooltip: column => `Sắp xếp cho ${column.label}`
                },
                pagination: {
                    next: 'Trang kế',
                    previous: 'Trang trước',
                    rowsPerPage: 'Số dòng',
                    displayRows: 'trên tổng số',
                },
                toolbar: {
                    search: 'Tìm kiếm',
                    downloadCsv: 'Tải CSV',
                    print: 'In',
                    viewColumns: 'Ẩn/Hiện cột',
                    filterTable: 'Lọc bảng',
                },
                // filter: {
                //     all: 'All',
                //     title: 'FILTERS',
                //     reset: 'RESET',
                // },
                // viewColumns: {
                //     title: 'Show Columns',
                //     titleAria: 'Show/Hide Table Columns',
                // },
                // selectedRows: {
                //     text: 'row(s) selected',
                //     delete: 'Delete',
                //     deleteAria: 'Delete Selected Rows',
                // },
            },
            onDownload: (buildHead, buildBody, columns1, data) => {
                return '\uFEFF' + buildHead(columns1) + buildBody(data);
            }
        };
        const columns = [
            resource.product_line,
            resource.product_description,
            resource.provider_name,
            resource.created_date2,
            resource.amount,
            resource.asset_id,
            resource.transaction_id,
            {
                name: resource.action_group_button,
                options: {
                    filter: false,
                    sort: false,
                    download: false,
                    print: false,
                    customBodyRender: (value, tableMeta) => {
                        if (tableMeta && tableMeta.rowData[6]) {
                            return (
                                <div className='btn-group'>
                                    <TransitionsModal value={tableMeta.rowData[6]}
                                                      downloadQRCode={onDownloadQRCode}/>
                                    <Tooltip title={resource.btn_history} className='btn-group-btn'>
                                        <IconButton
                                            onClick={(e) => this.openModal(e, tableMeta.rowData[6], 1, tableMeta.rowData[0])}>
                                            <HistoryIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    {status === 'F' && !isLoading &&
                                    <Tooltip title={resource.btn_append} className='btn-group-btn'>
                                        <IconButton
                                            onClick={(e) => this.openModal(e, tableMeta.rowData[6], 5, tableMeta.rowData[7])}>
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {status === 'F' && !isLoading &&
                                    <Tooltip title={resource.btn_transfer} className='btn-group-btn'>
                                        <IconButton
                                            onClick={(e) => this.openModal(e, tableMeta.rowData[6], 2, tableMeta.rowData[7])}>
                                            <LocalShippingIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {status === 'F' && !isLoading &&
                                    <Tooltip title={resource.btn_divide} className='btn-group-btn'>
                                        <IconButton
                                            onClick={(e) => this.openModal(e, tableMeta.rowData[6], 3, tableMeta.rowData[7])}>
                                            <ViewStreamIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                    {status === 'F' && !isLoading &&
                                    <Tooltip title={resource.btn_burn} className='btn-group-btn'>
                                        <IconButton
                                            onClick={(e) => this.openModal(e, tableMeta.rowData[6], 6, tableMeta.rowData[7])}>
                                            <RemoveCircleOutlineIcon/>
                                        </IconButton>
                                    </Tooltip>}
                                </div>
                            );
                        }
                    }
                }
            },
            {
                name: 'Mã mặt hàng',
                options: {
                    display: 'false'
                }
            }
        ];
        return (
            <>
                <CssBaseline/>
                <header style={{paddingLeft: 16}}>
                    <Typography variant='h4'
                                component='h4'>{resource.supply_chain_form}</Typography>
                </header>
                <div className='form-container' style={{marginTop: 16}}>
                    <Form
                        onSubmit={this.confirmSubmit}
                        initialValues={this.defaultValue}
                        validate={this.validate}
                        render={({handleSubmit, submitting, values, form}) => (
                            <form onSubmit={handleSubmit} id='bigChainForm' name='bigChainForm' noValidate
                                  autoComplete={'off'}>
                                <Paper style={{padding: 16}}>
                                    <Grid container alignItems='flex-start' spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl component='fieldset'>
                                                <Tooltip
                                                    className='primary-color'
                                                    title='Basic Information'
                                                    placement='right'
                                                >
                                                    <Typography style={{width: 'fit-content', marginBottom: 8}}>
                                                        Tìm kiếm
                                                    </Typography>
                                                </Tooltip>
                                                <FormGroup row>
                                                    <Grid container alignItems='flex-start' spacing={2}>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                fullWidth
                                                                name='productLine'
                                                                component={TextField}
                                                                type='text'
                                                                label={resource.product_line}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                fullWidth
                                                                name='productDescription'
                                                                component={TextField}
                                                                type='text'
                                                                label={resource.product_description}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                name='providerName'
                                                                fullWidth
                                                                component={TextField}
                                                                type='text'
                                                                label={resource.provider_name}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                name='assetId'
                                                                fullWidth
                                                                component={TextField}
                                                                type='text'
                                                                label={resource.asset_id}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                name='transactionId'
                                                                fullWidth
                                                                component={TextField}
                                                                type='text'
                                                                label={resource.transaction_id}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <Field
                                                                name='amount'
                                                                fullWidth
                                                                component={TextField}
                                                                type='number'
                                                                label={resource.amount}
                                                                onChange={() => this.setState({...values})}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <Grid container>
                                                                    <KeyboardDatePicker
                                                                        autoOk
                                                                        disableToolbar
                                                                        variant='inline'
                                                                        format='MM/dd/yyyy'
                                                                        id='date-picker-inline'
                                                                        label={resource.created_date2}
                                                                        value={timeStamp}
                                                                        onChange={(newDate) => this.setState({
                                                                            ...values,
                                                                            timeStamp: newDate
                                                                        })}
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </MuiPickersUtilsProvider>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                                            <FormControl component='fieldset'>
                                                                <FormLabel component='legend'>Trạng thái</FormLabel>
                                                                <RadioGroup row>
                                                                    <FormControlLabel
                                                                        label={resource.unspent}
                                                                        control={
                                                                            <Field
                                                                                name='status'
                                                                                component={Radio}
                                                                                type='radio'
                                                                                value='F'
                                                                            />
                                                                        }
                                                                    />
                                                                    <FormControlLabel
                                                                        label={resource.spent}
                                                                        control={
                                                                            <Field
                                                                                name='status'
                                                                                component={Radio}
                                                                                type='radio'
                                                                                value='T'
                                                                            />
                                                                        }
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </FormGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container justify='center' spacing={2} style={{marginTop: 16}}>
                                        <Grid item>
                                            <Button style={{margin: '0 auto'}} onClick={() => this.clearFields(form)}
                                                    className='text-btn'
                                                    color='primary'>{resource.reset_btn}</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button style={{height: 40, margin: '0 auto'}}
                                                    variant='contained' size='small' color='primary'
                                                    onClick={() => this.searchOnClick(values)}><Search/> {resource.search_btn}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button style={{height: 40, margin: '0 auto'}}
                                                    variant='contained' size='small' color='secondary'
                                                    onClick={(e) => this.openModal(e, null, 4)}><AddIcon/> {resource.create_asset_btn}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <input
                                                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                                id='importVersionInput'
                                                multiple
                                                type='file'
                                                onChange={(e) => this.handleReadExcelFile(e)}
                                                style={{display: 'none'}}
                                            />
                                            <label htmlFor='importVersionInput'>
                                                <Button component={'span'} variant='contained' size='small' style={{
                                                    height: 40,
                                                    margin: '0 auto',
                                                    backgroundColor: '#9c27b0',
                                                    color: '#fff'}}>
                                                    <GetAppIcon/>
                                                    {resource.create_asset_from_csv_btn}
                                                </Button>
                                            </label>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </form>
                        )}
                    />
                </div>
                <MUIDataTable
                    title={<Typography
                        component='div'
                        style={{fontSize: 16, fontWeight: 500, color: '#263238', letterSpacing: -0.05, marginTop: 16}}>
                        {resource.transaction_list}
                        {isLoading &&
                        <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                    </Typography>}
                    rowsPerPage={pageSize}
                    className='supply-chain-form-table generic-data-tables'
                    data={this.createData(this.state.results)}
                    columns={columns}
                    options={options}
                />
                {/* view modal */}
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenHistoryModal}
                    onClose={() => this.closeModal(1)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenHistoryModal}>
                        <div style={commonModalStyle.paper}>
                            <AssetHistoryModal productLine={this.state.selectedProductLineName}
                                               history={this.props.history}
                                               handleNavigateToOtherTransactionHistory={this.onNavigateToOtherTransactionHistory}
                                               navigateToFirstTransaction={this.onNavigateToOtherTransactionHistory}
                                               transactionId={this.state.filterTransaction}
                                               historyList={this.state.histories}
                                               closeModal={this.closeModal}/>
                        </div>
                    </Fade>
                </MatModal>
                {/* transfer modal */}
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenTransferModal}
                    onClose={() => this.closeModal(2)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenTransferModal}>
                        <div style={commonModalStyle.paper}>
                            <TransferForm
                                onSuccess={this.onSuccessOperation}
                                transaction={this.state.filterTransaction}
                                selectedOutputIndex={this.state.selectedOutputIndex}
                                closeModal={this.closeModal}
                                history={this.props.history}
                                location={this.props.location}
                                props={this.props['props']}/>
                        </div>
                    </Fade>
                </MatModal>
                {/* divide modal */}
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenDivideModal}
                    onClose={() => this.closeModal(3)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenDivideModal}>
                        <div style={commonModalStyle.paper}>
                            <DivideModal
                                onSuccess={this.onSuccessOperation}
                                transaction={this.state.filterTransaction}
                                selectedOutputIndex={this.state.selectedOutputIndex}
                                closeModal={this.closeModal}/>
                        </div>
                    </Fade>
                </MatModal>
                {/* add new modal */}
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenAddNewModal}
                    onClose={() => this.closeModal(4)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenAddNewModal}>
                        <div style={commonModalStyle.paper}>
                            <AddNewModal
                                onSuccess={this.onSuccessOperation}
                                closeModal={this.closeModal}/>
                        </div>
                    </Fade>
                </MatModal>
                {/* add meta */}
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenAddMetaModal}
                    onClose={() => this.closeModal(5)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenAddMetaModal}>
                        <div style={commonModalStyle.paper}>
                            <AddMetaModal
                                onSuccess={this.onSuccessOperation}
                                transaction={this.state.filterTransaction}
                                divideTransactions={this.state.divideTransactions}
                                selectedOutputIndex={this.state.selectedOutputIndex}
                                closeModal={this.closeModal}/>
                        </div>
                    </Fade>
                </MatModal>
            </>
        );
    }
}
