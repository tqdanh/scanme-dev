import * as React from 'react';
import {ProductSM} from '../../search-model/ProductSM';
import {SearchComponent} from '../../../common/component/SearchComponent';
import {HistoryProps} from '../../../common/component/HistoryProps';
import {SearchState} from '../../../common/component/SearchState';
import {ProductModel} from '../../model/ProductModel';
import applicationContext from '../../config/ApplicationContext';
import {
    Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    ExpansionPanel, ExpansionPanelDetails,
    ExpansionPanelSummary, FormControl, FormControlLabel, FormGroup, FormLabel, Grid,
    Paper, RadioGroup,
    Tooltip,
    Typography
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MUIDataTable from 'mui-datatables';
import {storage} from '../../../common/storage';
import config from '../../../config';
import './product-list.component.scss';
import '../common/style.scss';
import {ResourceManager} from '../../../common/ResourceManager';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import {Field, Form} from 'react-final-form';
import {Radio, TextField} from 'final-form-material-ui';
import Search from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';

export class ProductList extends SearchComponent<ProductModel, ProductSM, HistoryProps, SearchState<ProductModel>> {
    localState = {
        productID: '',
        productName: '',
        status: '0'
    };
    private readonly productService = applicationContext.getProductService();
    private providerId = storage.getProviderIdOfUser() || '';

    constructor(props) {
        super(props, applicationContext.getProductService(), null);
        this.state = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            itemTotal: this.itemTotal,
            results: [],
            isLoading: false,
            resultDialogOpen: false,
        };
    }

    componentDidMount() {
        this.searchModelByPageIndexAndPageSize();
    }

    getSearchModel() {
        const s = this.populateSearchModel();
        const {pageIndex, pageSize} = this.state;
        const {productID, productName, status} = this.localState;
        Object.assign(s, {
            _id: productID,
            name: productName,
            status,
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
        this.productService.getSearchProduct(searchModel, this.providerId, searchModel.status).subscribe((data) => {
            this.setState({
                results: data.results,
                itemTotal: data.itemTotal,
                isLoading: false,
                pageSize,
                pageIndex
            });
        });
    }

    createData = (products: any[]): any[] => {
        const displayData = [];
        console.log(products);
        products.forEach((product) => {
            displayData.push([
                product.imageAds,
                product._id,
                product.name,
                product.status === 0 ? 'Đang bán trên thị trường' : product.status === 1 ? 'Chưa bán trên thị trường' : 'Không còn bán',
                product.introduction
            ]);
        });
        console.log(displayData);
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
            rowsPerPageOptions: this.pageSizes,
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
            }
        };
        const columns = [
            {
                name: 'Hình ảnh', options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta) => {
                        console.log(value);
                        console.log(tableMeta);
                        return <img className='img-ad-product' src={`${config.imageURL}/${value}`}
                                    alt={'product-ad-image'} width='64px' height='64px'
                                    />;
                    }
                }
            },
            'ID',
            'Tên sản phẩm',
            'Trạng thái',
            'Giới thiêu',
            {
                name: resource.action_group_button,
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return <div className='btn-group'>
                            <Tooltip title={'Danh sách hàng hóa'} className='btn-group-btn'>
                                <IconButton
                                    onClick={() => this.props.history.push(`/product/${tableMeta.rowData[1]}/item`, tableMeta.rowData[2])}
                                    style={{color: '#607d8b'}}>
                                    <ListIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Chỉnh sửa'} className='btn-group-btn'>
                                <IconButton
                                    onClick={() => this.props.history.push(`/product/${tableMeta.rowData[1]}/edit`)}
                                    style={{color: '#2979ff'}}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Xóa sản phẩm này'} className='btn-group-btn'>
                                <IconButton
                                    onClick={(e) => this.handleDeleteProduct(tableMeta.rowData[1])}
                                    style={{color: '#d61414'}}>
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>;
                    }
                }
            }
        ];
        return <React.Fragment>
            <header className='product-page-header'>
                <Typography component='h4' variant='h4'>Danh sách sản phẩm</Typography>
                <div className='actions-btn'>
                    <Button onClick={() => this.props.history.push('/product/add')}
                            variant='contained' size='small' color='primary'><AddIcon/> Thêm sản phẩm</Button>
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
                        initialValues={{status: '0'}}
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
                                                        name='productID'
                                                        component={TextField}
                                                        type='text'
                                                        label={resource.product_id}
                                                        InputLabelProps={{shrink: true}}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Field
                                                        fullWidth
                                                        name='productName'
                                                        component={TextField}
                                                        type='text'
                                                        label={resource.product_name}
                                                        InputLabelProps={{shrink: true}}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl component='fieldset'>
                                                        <FormLabel
                                                            component='legend'>{resource.product_status}</FormLabel>
                                                        <RadioGroup row>
                                                            <FormControlLabel
                                                                label={resource.product_status_0}
                                                                control={
                                                                    <Field
                                                                        name='status'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value='0'
                                                                    />
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                label={resource.product_status_1}
                                                                control={
                                                                    <Field
                                                                        name='status'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value='1'
                                                                    />
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                label={resource.product_status_2}
                                                                control={
                                                                    <Field
                                                                        name='status'
                                                                        component={Radio}
                                                                        type='radio'
                                                                        value='2'
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
                        {'Danh sách sản phẩm'}
                        {isLoading &&
                        <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                    </Typography>}
                    rowsPerPage={pageSize}
                    className='product-form-table generic-data-tables'
                    data={this.createData(this.state.results)}
                    columns={columns}
                    options={options}
                />
                <Dialog
                    open={this.state.resultDialogOpen}
                    onClose={() => this.handleCloseResultDialog(this.state.isDeleteProductSuccessful)}
                    aria-labelledby='info-dialog-title'
                    aria-describedby='info-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}}
                                 id='alert-dialog-title'>{this.state.isDeleteProductSuccessful ?
                        <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                        <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                    <DialogContent>
                        {this.state.isDeleteProductSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_product_success}
                            </DialogContentText>
                        )}
                        {!this.state.isDeleteProductSuccessful && (
                            <DialogContentText id='info-dialog-description'>
                                {resource.delete_product_failure}
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.handleCloseResultDialog(this.state.isDeleteProductSuccessful)}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>
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

    handleDeleteProduct = (productID: any) => {
        this.productService.deleteProduct(productID).subscribe(res => {
            if (res !== 'error') {
                this.setState({resultDialogOpen: true, isDeleteProductSuccessful: true});
            } else {
                this.setState({resultDialogOpen: true, isDeleteProductSuccessful: false});
            }
        });
    }
}
