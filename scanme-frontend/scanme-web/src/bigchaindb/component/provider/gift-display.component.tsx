import * as React from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid, InputLabel,
    Paper,
    RadioGroup, Select,
    Tooltip,
    Typography
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import MUIDataTable from 'mui-datatables';
import config from '../../../config';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import {ResourceManager} from '../../../common/ResourceManager';
import applicationContext from '../../config/ApplicationContext';
import {storage} from '../../../common/storage';
import './gift-display.component.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Field, Form} from 'react-final-form';
import {Radio, TextField} from 'final-form-material-ui';
import SearchIcon from '@material-ui/icons/Search';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as moment from 'moment';

export class GiftDisplayComponent extends React.Component<any, any> {
    private readonly organizationService = applicationContext.getOrganizationService();
    private providerId = storage.getProviderIdOfUser() || '';

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            itemTotal: null,
            results: [],
            isLoading: false,
            resultDialogOpen: false,
            untilSearchDate: null,
        };
    }

    componentDidMount(): void {
        const searchModel = {
            pageSize: this.state.pageSize,
            pageIndex: this.state.pageIndex,
            expiryDate: this.state.untilSearchDate && moment(this.state.untilSearchDate).format('YYYY-MM-DD') || null
        };
        this.organizationService.getGiftByOrgId(this.providerId, searchModel).subscribe(res => {
            if (res !== 'error') {
                this.setState({
                    results: res.results,
                    itemTotal: res.itemTotal,
                    isLoading: false,
                });
            }
        });
    }

    // handleChangeTable(action: any, tableState: any) {
    //     if (action === 'changeRowsPerPage') {
    //         this.setState({
    //             pageIndex: 1,
    //             pageSize: tableState.rowsPerPage,
    //             isLoading: true,
    //         }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex, this.state.pageSize));
    //     } else if (action === 'changePage') {
    //         this.setState({
    //             pageIndex: tableState.page + 1,
    //             isLoading: true,
    //         }, () => this.searchModelByPageIndexAndPageSize(this.state.pageIndex));
    //     }
    // }
    render() {
        const resource = ResourceManager.getResource();
        const {pageIndex, pageSize, itemTotal, isLoading} = this.state;
        const options = {
            filterType: 'multiselect',
            selectableRowsOnClick: true,
            elevation: 4,
            caseSensitive: true,
            responsive: 'scrollMaxHeight',
            rowsPerPage: pageSize,
            rowsPerPageOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
            searchPlaceholder: 'Search transaction',
            fixedHeaderOptions: {
                xAxis: false,
                yAxis: true
            },
            selectableRowsHeader: true,
            selectableRows: 'multiple',
            serverSide: true,
            count: itemTotal, // total Count for page index
            page: pageIndex - 1, // pageIndex
            // onTableChange: (action, tableState) => {
            //     this.handleChangeTable(action, tableState);
            // },
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
            }
        };
        const columns = [
            {
                name: 'Hình ảnh',
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta) => {
                        return <img className='gift-image' src={`${config.imageURL}/${value}`}
                                    alt={'gift-image'} width='64px' height='64px'
                        />;
                    }
                }
            },
            'Tên quà tặng',
            'Ngày hết hạn',
            'Số lượng',
            'Điểm',
            {
                name: resource.action_group_button,
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta) => {
                        return <div className='btn-group'>
                            <Tooltip title={'Chỉnh sửa'} className='btn-group-btn'>
                                <IconButton
                                    onClick={() => this.props.history.push(`/gift/${tableMeta.rowData[1]}/edit`)}
                                    style={{color: '#2196f3'}}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Xóa quà tặng'} className='btn-group-btn'>
                                <IconButton
                                    onClick={(e) => this.handleDeleteGift(tableMeta.rowData[1])}
                                    style={{color: '#d61414'}}>
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>;
                    }
                }
            }
        ];
        return <Paper>
            {/*<header>*/}
            {/*    <h1>Test</h1>*/}
            {/*</header>*/}
            <main>
                <ExpansionPanel elevation={4} defaultExpanded={true}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls='panel-search-content'
                        id='panel-search-header'
                    >
                        <SearchIcon/> <Typography>Tìm kiếm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container alignItems='flex-start' spacing={2}>
                            <Grid item xs={12}>
                                <Typography style={{marginBottom: 16}} component={'span'}>Lọc các quà tặng còn hiệu lực cho đến ngày:</Typography>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        id='startDate'
                                        autoOk
                                        disableToolbar
                                        format='MM/dd/yyyy'
                                        value={this.state.untilSearchDate}
                                        onChange={(newDate) => this.setState({
                                            untilSearchDate: newDate
                                        })}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        required
                                        label={'Chọn ngày mốc'}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='contained' color='primary'
                                    onClick={() => this.onSearch()}><SearchIcon/>{resource.search_btn}
                                </Button>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <MUIDataTable
                    title={<Typography
                        component='div'
                        style={{fontSize: 16, fontWeight: 500, color: '#263238', letterSpacing: -0.05}}>
                        {'Danh sách quà tặng'}
                        {isLoading &&
                        <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                    </Typography>}
                    rowsPerPage={pageSize}
                    className='gift-table generic-data-tables'
                    data={this.createData(this.state.results)}
                    columns={columns}
                    options={options}
                />
                <Dialog
                    open={this.state.resultDialogOpen}
                    onClose={() => this.handleCloseResultDialog(this.state.isDeleteGiftSuccessful)}
                    aria-labelledby='info-dialog-title'
                    aria-describedby='info-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}}
                                 id='alert-dialog-title'>{this.state.isDeleteGiftSuccessful ?
                        <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                        <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                    <DialogContent>
                        {this.state.isDeleteGiftSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_product_success}
                            </DialogContentText>
                        )}
                        {!this.state.isDeleteGiftSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_product_failure}
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.handleCloseResultDialog(this.state.isDeleteGiftSuccessful)}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </Paper>;
    }

    createData = (gifts: any[]): any[] => {
        const displayData = [];
        gifts.forEach((gift) => {
            displayData.push([
                gift.image,
                gift.name,
                moment(gift.expiryDate).format('DD-MM-YYYY'),
                gift.quantity,
                gift.point,
            ]);
        });
        return displayData;
    }

    private handleDeleteGift(id: any) {
        this.organizationService.deleteGift(id).subscribe(res => {
            if (res !== 'error') {
                this.setState({resultDialogOpen: true, isDeleteGiftSuccessful: true});
            } else {
                this.setState({resultDialogOpen: true, isDeleteGiftSuccessful: false});
            }
        });
    }

    private handleCloseResultDialog(isDeleteGiftSuccessful: any) {
        this.setState({resultDialogOpen: false}, () => {
        });
    }

    private clearFields() {
    }

    private onSearch() {
        this.componentDidMount();
    }
}

