import * as React from 'react';
import {SearchComponent} from '../../../common/component/SearchComponent';
import {HistoryProps} from '../../../common/component/HistoryProps';
import {SearchState} from '../../../common/component/SearchState';
import applicationContext from '../../config/ApplicationContext';
import {
    Backdrop,
    Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    ExpansionPanel, ExpansionPanelDetails,
    ExpansionPanelSummary, Fade, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Modal as MatModal, Paper,
    RadioGroup,
    Tooltip,
    Typography
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MUIDataTable from 'mui-datatables';
import '../common/style.scss';
import {ResourceManager} from '../../../common/ResourceManager';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import {Field, Form} from 'react-final-form';
import {Radio, TextField} from 'final-form-material-ui';
import Search from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import {ItemModel} from '../../model/ItemModel';
import {ItemSM} from '../../search-model/ItemSM';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterIcon from '@material-ui/icons/FilterList';
import InfoIcon from '@material-ui/core/SvgIcon/SvgIcon';
import {commonModalStyle, getURLString, onDownloadQRCode, TransitionsModal} from '../supply-chain-form';
import SaveIcon from '@material-ui/icons/Save';

const QRCode = require('qrcode.react');

export class ItemList extends SearchComponent<ItemModel, ItemSM, HistoryProps, SearchState<ItemModel>> {
    productCatId: string;
    localState = {
        actionCode: '-1',
        itemID: '',
        lot: '',
        point: ''
    };
    private readonly itemService = applicationContext.getItemService();

    constructor(props) {
        super(props, applicationContext.getItemService(), null);
        console.log('props', props);
        // @ts-ignore
        this.productCatId = this.props.props.match.params.id;
        this.state = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            itemTotal: this.itemTotal,
            results: [],
            isLoading: false,
            resultDialogOpen: false,
            // mfg, exp are managed by state
            mfg: null,
            exp: null,
            rowsSelected: undefined,
            some: 1,
            confirmDialogOpen: false,
            invalidItems: false,
            returnedTxId: '',
            isOpenViewQr: false,
            transactionIdByItemIds: {}
        };
    }

    componentDidMount() {
        this.searchModelByPageIndexAndPageSize();
    }

    getSearchModel() {
        const s = this.populateSearchModel();
        const {pageIndex, pageSize, mfg, exp} = this.state;
        const {
            actionCode,
            itemID,
            lot,
            point
        } = this.localState;
        Object.assign(s, {
            _id: itemID,
            mfg: mfg ? moment(mfg).format('YYYY-MM-DD') : null,
            exp: exp ? moment(exp).format('YYYY-MM-DD') : null,
            lot,
            point,
            actionCode: actionCode === '-1' ? null : +actionCode,
            pageIndex,
            pageSize
        });
        return s;
    }

    searchModelByPageIndexAndPageSize(pageIndexP?: number, pageSizeP?: number) {
        this.setState({isLoading: true});
        const searchModel = this.getSearchModel();
        const pageIndex = pageIndexP || this.state.pageIndex;
        const pageSize = pageSizeP || this.state.pageSize;
        Object.assign(searchModel, {pageIndex, pageSize});
        this.itemService.getSearchItem(searchModel, this.productCatId).subscribe((data) => {
            if (data !== 'error') {
                this.setState({
                    results: data.results,
                    itemTotal: data.itemTotal,
                    isLoading: false,
                    pageSize,
                    pageIndex
                }, () => {
                    const activatedItemsId = [];
                    this.state.results.forEach(item => {
                        if (item.actionCode !== 0) {
                            activatedItemsId.push(item._id);
                        }
                    });
                    this.itemService.getSearchTxIdByItemId(activatedItemsId).subscribe(res => {
                        if (res !== 'error') {
                            if (res.length <= 0) {
                                return;
                            }
                            let normalizeData = {};
                            res.forEach(item => {
                                normalizeData = {...normalizeData, [item.itemId]: item.transactionId};
                            });
                            this.setState({
                                transactionIdByItemIds: normalizeData
                            });
                        }
                    });
                });
            }
        });
    }

    getTransactionId = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        if (productId && productId !== '-') {
            this.setState({
                returnedTxId: productId,
                isOpenViewQr: true
            });
        }
    }

    createData = (items: any[]): any[] => {
        const displayData = [];
        items.forEach((productItem) => {
            displayData.push([
                productItem._id,
                productItem.productCatId,
                productItem.mfg,
                productItem.exp,
                productItem.lot,
                productItem.point,
                productItem.actionCode === 0 ? 'Chưa kích hoạt' :
                    productItem.actionCode === 1 ? 'Đã kích hoạt' :
                        productItem.actionCode === 2 ? 'Đã quét' : 'Đã tính điểm',
                this.state.transactionIdByItemIds[productItem._id] || '-'
            ]);
        });
        return displayData;
    }
    validate = values => {
        const errors: any = {};
        // if (!values.metaNoteAction) {
        //     errors.metaNoteAction = 'Required';
        // }
        return {...errors};
    }
    clearFields = (form: any) => {
        form.reset();
    }
    handleCloseResultDialog = (isAddSuccess) => {
        this.setState({resultDialogOpen: false}, () => {
            this.searchModelByPageIndexAndPageSize(); // reload page
        });
    }

    flushRowsSelected = () => {
        this.setState({rowsSelected: null}, () =>
            this.setState({rowsSelected: undefined})
        );
    }

    setSome = () => {
        // @ts-ignore
        this.setState({some: this.state.some++});
    }
    handleCloseConfirm = () => {
        this.setState({confirmDialogOpen: false});
    }
    handleCloseConfirmAndNotEdit = () => {
        this.setState({confirmDialogOpen: false, confirm: false});
    }
    handleCloseViewQrModal = () => {
        this.setState({
            isOpenViewQr: false
        });
    }

    render() {
        const resource = ResourceManager.getResource();
        const {pageIndex, pageSize, itemTotal, isLoading, mfg, exp} = this.state;
        const options = {
            filterType: 'multiselect',
            selectableRowsOnClick: true,
            elevation: 4,
            caseSensitive: true,
            responsive: 'scrollMaxHeight',
            rowsPerPage: pageSize,
            rowsPerPageOptions: this.pageSizes,
            searchPlaceholder: 'Tìm mặt hàng',
            fixedHeaderOptions: {
                xAxis: false,
                yAxis: true
            },
            selectableRowsHeader: true,
            selectableRows: 'multiple',
            serverSide: true,
            count: itemTotal, // total Count for page index
            page: pageIndex - 1, // pageIndex
            onTableChange: (action, tableState) => {
                this.handleChangeTable(action, tableState);
            },
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
                filter: {
                    all: 'All',
                    title: 'FILTERS',
                    reset: 'RESET',
                },
                viewColumns: {
                    title: 'Show Columns',
                    titleAria: 'Show/Hide Table Columns',
                },
                selectedRows: {
                    text: 'row(s) selected',
                    delete: 'Delete',
                    deleteAria: 'Delete Selected Rows',
                },
            },
            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                return <div>
                    <Tooltip title={'Sửa các mặt hàng'}>
                        <IconButton onClick={() => this.handleEditItems(selectedRows.data, displayData)}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Xóa các mặt hàng'}>
                        <IconButton onClick={() => this.handleDeleteItems(selectedRows.data, displayData)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </div>;
            },
            onDownload: (buildHead, buildBody, columns1, data) => {
                return '\uFEFF' + buildHead(columns1) + buildBody(data);
            }
        };
        const columns = [
            'Mã mặt hàng',
            'Mã sản phẩm',
            'Ngày sản xuất',
            'Ngày hết hạn',
            'Mã lô',
            'Điểm',
            'Trạng thái',
            {
                name: resource.action_group_button,
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    print: false,
                    customBodyRender: (value, tableMeta) => {
                        return <div className='btn-group'>
                            <Tooltip title={'Lấy mã truy xuất'} className='btn-group-btn'>
                                <IconButton
                                    disabled={tableMeta.rowData[6] !== 'Đã kích hoạt'}
                                    onClick={(event) => this.getTransactionId(event, tableMeta.rowData[8])}
                                    style={{color: tableMeta.rowData[6] !== 'Đã kích hoạt' ? '#9E9E9E' : '#2979ff'}}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>;
                    }
                }
            },
            {
                name: 'Mã giao dịch',
                options: {
                    display: 'false',
                }
            }
        ];
        return <React.Fragment>
            <header className='product-page-header'>
                <Typography component='h4' variant='h4'>Danh sách mặt hàng
                    <br/>
                    <Typography component={'h6'} variant={'h6'}>&nbsp; {this.props.history.location.state}</Typography>
                    <Button
                    onClick={() => this.props.history.push('/product')} className='text-btn'
                    color='secondary'><ArrowBackIcon/>  &nbsp; Quay
                    lại</Button>
                </Typography>
                <div className='actions-btn'>
                    <Button onClick={() => this.props.history.push(`/product/${this.productCatId}/item/add`)}
                            variant='contained' size='small' color='primary'><AddIcon/>Thêm mặt hàng</Button>
                </div>
            </header>
            <ExpansionPanel elevation={4}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls='panel-search-content'
                    id='panel-search-header'
                >
                    <SearchIcon/> <Typography>Tìm kiếm</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Form
                        onSubmit={() => {
                        }}
                        initialValues={{actionCode: '-1'}}
                        validate={this.validate}
                        render={({handleSubmit, submitting, values, form}) => (
                            <form onSubmit={handleSubmit} noValidate autoComplete={'off'} style={{width: '100%'}}>
                                <Grid container>
                                    <FormControl component='fieldset'>
                                        <FormGroup row>
                                            <Grid container alignItems='flex-start' spacing={2}>
                                                <Grid item xs={6}>
                                                    <Field
                                                        fullWidth
                                                        name='itemID'
                                                        component={TextField}
                                                        type='text'
                                                        label={resource.item_id}
                                                        InputLabelProps={{shrink: true}}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardDatePicker
                                                                autoOk
                                                                disableToolbar
                                                                variant='inline'
                                                                format='MM/dd/yyyy'
                                                                label={resource.mfg_date}
                                                                value={mfg}
                                                                onChange={(newDate) => this.setState({
                                                                    ...values,
                                                                    mfg: newDate
                                                                })}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                InputLabelProps={{shrink: true}}

                                                            />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardDatePicker
                                                                autoOk
                                                                disableToolbar
                                                                variant='inline'
                                                                format='MM/dd/yyyy'
                                                                label={resource.exp_date}
                                                                value={exp}
                                                                onChange={(newDate) => this.setState({
                                                                    ...values,
                                                                    exp: newDate
                                                                })}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                InputLabelProps={{shrink: true}}

                                                            />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Field
                                                        fullWidth
                                                        name='lot'
                                                        component={TextField}
                                                        type='text'
                                                        label={resource.lot}
                                                        InputLabelProps={{shrink: true}}

                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Field
                                                        fullWidth
                                                        name='point'
                                                        component={TextField}
                                                        type='number'
                                                        min={0}
                                                        max={10}
                                                        label={resource.point}
                                                        InputLabelProps={{shrink: true}}

                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl component='fieldset'>
                                                        <FormLabel component='legend'>Trạng thái</FormLabel>
                                                        <RadioGroup row>
                                                            <FormControlLabel
                                                                label='Tất cả'
                                                                control={
                                                                    <Field
                                                                        name='actionCode'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value={'-1'}
                                                                    />
                                                                }
                                                            />
                                                            <FormControlLabel
                                                              label='Chưa kích hoạt'
                                                              control={
                                                                  <Field
                                                                    name='actionCode'
                                                                    component={Radio}
                                                                    type='radio'
                                                                    value={'0'}
                                                                  />
                                                              }
                                                            />
                                                            <FormControlLabel
                                                              label='Đã kích hoạt'
                                                              control={
                                                                  <Field
                                                                    name='actionCode'
                                                                    component={Radio}
                                                                    type='radio'
                                                                    value={'1'}
                                                                  />
                                                              }
                                                            />
                                                            <FormControlLabel
                                                                label='Đã quét'
                                                                control={
                                                                    <Field
                                                                        name='actionCode'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value={'2'}
                                                                    />
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                label='Đã tính điểm'
                                                                control={
                                                                    <Field
                                                                        name='actionCode'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value={'3'}
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
                                <Grid container justify={'center'} spacing={2} style={{marginTop: 16}}>
                                    <Grid item>
                                        <Button style={{margin: '0 auto'}} onClick={() => this.clearFields(form)}
                                                className='text-btn'
                                                color='primary'>{resource.reset_btn}</Button>
                                        <Button
                                            variant='contained' color='primary'
                                            onClick={() => this.onSearch(values)}><Search/>{resource.search_btn}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <main>
                <MUIDataTable
                    title={<Typography
                        component='div'
                        style={{fontSize: 16, fontWeight: 500, color: '#263238', letterSpacing: -0.05}}>
                        {'Danh sách mặt hàng'}
                        {isLoading &&
                        <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                    </Typography>}
                    rowsPerPage={pageSize}
                    className='item-form-table generic-data-tables'
                    data={this.createData(this.state.results)}
                    columns={columns}
                    options={options}
                />
                {/*Confirm*/}
                <Dialog
                    open={this.state.confirmDialogOpen}
                    onClose={this.handleCloseConfirm}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'><InfoIcon style={{fontSize: 64}}
                                                                                                 className='dialog-icon-confirm'/></DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            {resource.divide_data_confirm}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseConfirmAndNotEdit} color='primary'>
                            {resource.cancel1}
                        </Button>
                        <Button
                            onClick={this.handleConfirm}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.resultDialogOpen}
                    onClose={() => this.handleCloseResultDialog(this.state.isDeleteItemsSuccessful)}
                    aria-labelledby='info-dialog-title'
                    aria-describedby='info-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}}
                                 id='alert-dialog-title'>{this.state.isDeleteItemsSuccessful ?
                        <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                        <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                    <DialogContent>
                        {this.state.isDeleteItemsSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_items_success}
                            </DialogContentText>
                        )}
                        {!this.state.isDeleteItemsSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_items_failure}
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.handleCloseResultDialog(this.state.isDeleteItemsSuccessful)}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.invalidItems}
                    onClose={() => {
                    }}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'><InfoIcon style={{fontSize: 64}}
                                                                                                 className='dialog-icon-confirm'/></DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            {`Xin hãy chọn các mặt hàng hợp lệ`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.setState({invalidItems: false})}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>
                <MatModal
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={{...commonModalStyle.modal, textAlign: 'center'}}
                    open={this.state.isOpenViewQr}
                    onClose={this.handleCloseViewQrModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenViewQr}>
                        <div style={{...commonModalStyle.paper, width: 'unset', padding: '16px'}}>
                            <h2 id='transition-modal-title'>Link truy xuất</h2>
                            <QRCode
                                id='qr-code'
                                className='qrcode'
                                value={getURLString(this.state.returnedTxId)}
                                size={192}
                                bgColor={'#00a2e8'}
                                fgColor={'#ffffff'}
                                level={'L'}
                                includeMargin={true}
                                renderAs={'canvas'}
                            />
                            <Button
                                onClick={onDownloadQRCode}
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
            </main>
        </React.Fragment>;
    }

    handleChangeTable(action: any, tableState: any) {
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

    onSearch = (values) => {
        this.localState = {...values};
        this.searchModelByPageIndexAndPageSize();
    }

    handleConfirm = () => {
        this.setState({confirmDialogOpen: false, confirm: true}, () => {
        });
    }

    private handleEditItems(selectedIndexes, data) {
        let editItems = [];
        selectedIndexes.forEach(selected => {
            const dataItem = data.find(dataRow => dataRow.dataIndex === selected.dataIndex).data;
            // dataItem.pop();
            editItems.push(dataItem);
        });
        editItems = editItems.filter(id => !!id);
        if (editItems.length > 0) {
            this.props.history.push(`/product/${this.productCatId}/item/update`, {data: [...editItems]});
        } else {
            this.setState({invalidItems: true});
        }
    }

    private handleDeleteItems(selectedIndexes, data) {
        let deleteItemIds = [];
        selectedIndexes.forEach(selected => {
            deleteItemIds.push(data.find(dataRow => dataRow.dataIndex === selected.dataIndex).data[0]);
        });
        deleteItemIds = deleteItemIds.filter(id => !!id);
        if (deleteItemIds.length > 0) {
            this.itemService.deleteItems(deleteItemIds).subscribe(res => {
                if (res !== 'error') {
                    this.setState({resultDialogOpen: true, isDeleteItemsSuccessful: true});
                } else {
                    this.setState({resultDialogOpen: true, isDeleteItemsSuccessful: false});
                }
            });
        }
    }
}
