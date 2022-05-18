import * as React from 'react';
import {
    Backdrop,
    CircularProgress, Fade, Grid, Modal as MatModal,
    Paper,
    Tooltip,
    Typography
} from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import RestoreIcon from '@material-ui/icons/Restore';
import {ResourceManager} from '../../../common/ResourceManager';
import applicationContext from '../../config/ApplicationContext';
import {storage} from '../../../common/storage';
import * as moment from 'moment';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomerChart from '../pie-chart';
const commonModalStyle = {
    modal: {
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto',
        margin: '0 auto',
        // width: '60%'
    },
    paper: {
        backgroundColor: '#fff',
        boxShadow: '0px 10px 13px -6px rgba(0,0,0,0.2), 0px 20px 31px 3px rgba(0,0,0,0.14), 0px 8px 38px 7px rgba(0,0,0,0.12)',
        borderRadius: 3,
        // padding: '0 0 24px',
        height: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        width: '60%',
        padding: 16
    }
};
export class CustomerDisplayComponent extends React.Component<any, any> {
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
            isOpenScanHistory: false,
            scanItems: []
        };
    }

    componentDidMount(): void {
        const searchModel = {
            pageSize: this.state.pageSize,
            pageIndex: this.state.pageIndex
        };
        this.organizationService.getConsumerByOrgId(this.providerId, searchModel).subscribe(res => {
            if (res !== 'error') {
                this.setState({
                    results: res,
                    itemTotal: res.length,
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
    calculatePercentByTwoDecimal = (each: number, total: number) => {
        return each / total * 100;
    }
    countGender = (customers: any[]) => {
        let male = 0;
        let feMale = 0;
        if (customers.length > 0) {
            customers.forEach(customer => {
                if (customer.sex === 'M') {
                    male++;
                } else {
                    feMale++;
                }
            });
        }
        return {
            male,
            feMale
        };
    }
    calculateChartData = () => {
        return [
            {
                percent: Math.round(this.calculatePercentByTwoDecimal(this.countGender(this.state.results).male, this.state.results.length) * 100) / 100,
                color: 'blue'
            },
            {
                percent: Math.round(this.calculatePercentByTwoDecimal(this.countGender(this.state.results).feMale, this.state.results.length) * 100) / 100,
                color: 'red'
            }
        ];
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
            labels: ['Nam', 'Nữ']
        };
        return data;
    }
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
            serverSide: false,
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
            'Mã khách hàng',
            'Tên khách hàng',
            'Điện thoại',
            'CMND',
            'Giới tính',
            'Ngày sinh',
            'Địa chỉ',
            'Email',
            'Mã thẻ',
            'Điểm',
            'Loại thành viên',
            {
                name: resource.action_group_button,
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta) => {
                        return <div className='btn-group'>
                            <Tooltip title={'Chi tiết'} className='btn-group-btn'>
                                <IconButton
                                    onClick={() => this.setState({isOpenScanHistory: true, scanItems: tableMeta.rowData[11], customerName: tableMeta.rowData[1]}) }
                                    style={{color: '#f33077'}}>
                                    <RestoreIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>;
                    }
                }
            }
        ];
        const data = this.createChartData();
        return <main>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MUIDataTable
                            title={<Typography
                                component='div'
                                style={{fontSize: 16, fontWeight: 500, color: '#263238', letterSpacing: -0.05}}>
                                {'Danh sách khách hàng'}
                                {isLoading &&
                                <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                            </Typography>}
                            rowsPerPage={pageSize}
                            className='customer-table generic-data-tables'
                            data={this.createData(this.state.results)}
                            columns={columns}
                            options={options}
                        />
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                        <CustomerChart generateNewColor={() => {}} title='Thống kê giới tính người dùng'
                                       data={data}/>
                    </Grid>
                </Grid>
                <MatModal
                    className='custom-modal'
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    style={commonModalStyle.modal}
                    open={this.state.isOpenScanHistory}
                    onClose={() => this.setState({isOpenScanHistory: false})}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.isOpenScanHistory}>
                        <div style={commonModalStyle.paper}>
                            <Grid container spacing={2} alignItems={'center'}>
                                <Grid item xs={12}>
                                    <Typography component={'h5'} variant={'h5'} style={{textAlign: 'center', marginBottom: 16}}>Lịch sử quét {this.state.customerName || ''}</Typography>
                                    <Paper elevation={4}>
                                        {this.state.scanItems.map((item, index) => <ExpansionPanel style={{marginBottom: 8}} key={index}>
                                            <ExpansionPanelSummary
                                                style={{background: '#e0e0e0'}}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls='panel1a-content'
                                                id='panel1a-header'
                                            >
                                                <Typography>ItemId: {item.itemId}</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <Grid item xs={4}>
                                                    <Typography component={'p'}>
                                                        Điểm: {item.point}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography component={'p'}>
                                                        Ngày quét: {new Date(item.scanDate).toLocaleString()}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography component={'p'}>
                                                        Địa chỉ: {item.location.join(', ')}
                                                    </Typography>
                                                </Grid>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>)}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>
                    </Fade>
                </MatModal>
            </main>;
    }

    createData = (customers: any[]): any[] => {
        const displayData = [];
        if (customers.length > 0) {
            customers.forEach((customer) => {
                displayData.push([
                    customer._id,
                    customer.fullname,
                    customer.telephone,
                    customer.idCard,
                    customer.sex === 'M' ? 'Nam' : 'Nữ',
                    moment(customer.birthDay).format('DD-MM-YYYY'),
                    customer.address,
                    customer.email,
                    customer.cardNumber,
                    customer.point,
                    customer.typeCard,
                    customer.items
                ]);
            });
        }
        return displayData;
    }
}

