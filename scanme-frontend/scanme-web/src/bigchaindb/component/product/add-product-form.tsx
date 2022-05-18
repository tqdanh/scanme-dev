import * as React from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary, FormControl, Grid, IconButton, InputLabel, MenuItem,
    Select, Table, TableBody, TableCell, TableHead, TableRow, TextareaAutosize, TextField, Tooltip,
    Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '../common/style.scss';
import './add-product-form.scss';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import {ResourceManager} from '../../../common/ResourceManager';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import BookIcon from '@material-ui/icons/BookOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import applicationContext from '../../config/ApplicationContext';
import {StringUtil} from '../../../common/util/StringUtil';
import * as uuidv4 from 'uuid/v4';
import {storage} from '../../../common/storage';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import config from '../../../config';
import {UploadImageButton} from '../common/uploadImageButton';
export class AddProductForm extends React.Component<any, any> {
    providerId = storage.getProviderIdOfUser() || '';
    isEditProduct: boolean;
    private readonly productService = applicationContext.getProductService();
    imgAd: string = '';
    imgUnit: string = '';
    introduction_imgIntro: string = '';
    ingredient_image: string = '';
    constructor(props) {
        super(props);
        this.isEditProduct = this.props.props.match.path === '/product/:id/edit';
        this.state = {
            productId: '',
            productName: '',
            status: '0',
            imgAd: '',
            imgUnit: '',
            product_intro: '',
            introduction_title: '',
            introduction_detail: '',
            introduction_imgIntro: '',
            introduction_ingredientInfo: {},
            introduction_note: '',
            ingredient_title: '',
            ingredient_detail: '',
            ingredient_image: '',
            ingredient_info: {},
            ingredient_note: '',
            orgId: '',
            intro_ingredient_key: '',
            intro_ingredient_value: '',
            ingredient_key: '',
            ingredient_value: '',
            adImg: [],
            unitImg: [],
            introImg: [],
            ingredientImg: [],
            isAddOrUpdateSuccess: false
        };
    }

    mapArrayAttributeToObject = (arr: any[]) => {
        const value = {};
        arr.forEach(item => {
            Object.assign(value, {[item.name]: item.value || ''});
        });
        return value;
    }
    mapProductToState = (model: any) => {
        if (model) {
            this.imgAd = model.imageAds || '';
            this.imgUnit = model.imageUnit || '';
            this.introduction_imgIntro = model.introductionDescriptions[0].images[0] || '';
            this.ingredient_image = model.ingredientDescriptions[0].images[0] || '';
            this.setState({
                productId: model._id,
                productName: model.name,
                status: model.status + '',
                imgAd: model.imageAds,
                imgUnit: model.imageUnit,
                product_intro: model.introduction,
                introduction_title: model.introductionDescriptions[0].title,
                introduction_detail: model.introductionDescriptions[0].description,
                introduction_imgIntro: model.introductionDescriptions[0].images[0],
                introduction_ingredientInfo: this.mapArrayAttributeToObject(model.introductionDescriptions[0].attributes),
                introduction_note: model.introductionDescriptions[0].notes[0],
                ingredient_title: model.ingredientDescriptions[0].title,
                ingredient_detail: model.ingredientDescriptions[0].description,
                ingredient_image: model.ingredientDescriptions[0].images[0],
                ingredient_info: this.mapArrayAttributeToObject(model.ingredientDescriptions[0].attributes),
                ingredient_note: model.ingredientDescriptions[0].notes[0],
                orgId: this.providerId,
                intro_ingredient_key: '',
                intro_ingredient_value: '',
                ingredient_key: '',
                ingredient_value: '',
                // files array for upload function
                adImg: [],
                unitImg: [],
                introImg: [],
                ingredientImg: [],
                resultDialogOpen: false
            });
        }
    }
    componentDidMount = () => {
        if (this.isEditProduct) {
            // get data
            const productId = this.props.props.match.params.id;
            this.productService.getProduct(productId).subscribe(res => {
                if (res !== 'error') {
                    this.setState({returnProduct: res}, () => this.mapProductToState(this.state.returnProduct));
                }
            });
        }
    }

    handleChange = (evt) => {
        const value =
            evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        this.setState({
            ...this.state,
            [evt.target.name]: value
        });
    }

    handleUploadImage = (name, event) => {
        const {files} = event.target;
        if (name === 'adImg') {
            this.setState({adImg: files});
        } else if (name === 'unitImg') {
            this.setState({unitImg: files});
        } else if (name === 'introImg') {
            this.setState({introImg: files});
        } else if (name === 'ingredientImg') {
            this.setState({ingredientImg: files});
        }
    }

    handleDeleteImage = (name) => {
        if (name === 'adImg') {
            this.setState({adImg: []});
        } else if (name === 'unitImg') {
            this.setState({unitImg: []});
        } else if (name === 'introImg') {
            this.setState({introImg: []});
        } else if (name === 'ingredientImg') {
            this.setState({ingredientImg: []});
        }
    }

    getCommonDropZoneProps() {
        return {
            acceptedFiles: ['image/*'],
            filesLimit: 1,
            maxFileSize: 3145728,
            dropzoneText: 'Kéo và thả hình vào đây hoặc click chọn, tối đa 3MB',
            showPreviews: false,
            showFileNames: false
        };
    }

    handleAddIntroIngredient = () => {
        if (!this.state.intro_ingredient_key || !this.state.intro_ingredient_value) {
            return;
        }
        const introduction_ingredientInfo = {...this.state.introduction_ingredientInfo};
        Object.assign(introduction_ingredientInfo, {[this.state.intro_ingredient_key]: this.state.intro_ingredient_value});
        this.setState({introduction_ingredientInfo});
    }

    handleAddIngredient = () => {
        if (!this.state.ingredient_key || !this.state.ingredient_value) {
            return;
        }
        const ingredient_info = {...this.state.ingredient_info};
        Object.assign(ingredient_info, {[this.state.ingredient_key]: this.state.ingredient_value});
        this.setState({ingredient_info});
    }

    handleDeleteIntroIngredient = (keyDelete) => {
        const introduction_ingredientInfo = {...this.state.introduction_ingredientInfo};
        if (introduction_ingredientInfo[keyDelete]) {
            delete introduction_ingredientInfo[keyDelete];
        }
        this.setState({introduction_ingredientInfo});
    }

    handleDeleteIngredient = (keyDelete) => {
        const ingredient_info = {...this.state.ingredient_info};
        if (ingredient_info[keyDelete]) {
            delete ingredient_info[keyDelete];
        }
        this.setState({ingredient_info});
    }
    handleCloseResultDialog = (isAddSuccess) => {
        this.setState({resultDialogOpen: false}, () => {
            // this.searchModelByPageIndexAndPageSize(); // reload page
        });
    }

    render() {
        const resource = ResourceManager.getResource();
        return <div style={{padding: 16}}>
            <header className='add-product-page-header'
                    style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                <Typography component='h4' variant='h4' style={{width: 'fit-content'}}>{!this.isEditProduct ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}<Button
                    onClick={() => this.props.history.push('/product')} className='text-btn'
                    color='secondary'><ArrowBackIcon/>  &nbsp; Quay
                    lại</Button>
                </Typography>
                <div className='actions-btn'>
                    <Button onClick={() => this.onSave()}
                            variant='contained' size='small' color='primary'><SaveIcon/> &nbsp; {!this.isEditProduct ? 'Thêm sản phẩm' : 'Lưu'}</Button>
                </div>

            </header>
            <main>
                {/* Basic Info content */}
                <ExpansionPanel elevation={4} defaultExpanded={true}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                    >
                        <InfoIcon className={'primary-color'}/> &nbsp; <Typography>Nhập thông tin cơ bản</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        required
                                        name='productName'
                                        label='Tên sản phẩm'
                                        onChange={this.handleChange}
                                        InputLabelProps={{shrink: true}}
                                        value={this.state.productName}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <InputLabel shrink={true} id='select-status'>Trạng thái</InputLabel>
                                    <Select
                                        value={this.state.status}
                                        name='status'
                                        onChange={this.handleChange}
                                        id='select-status'
                                    >
                                        <MenuItem value={'0'}>Đang bán trên thị trường</MenuItem>
                                        <MenuItem value={'1'}>Chưa bán trên thị trường</MenuItem>
                                        <MenuItem value={'2'}>Không còn bán</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography style={{marginBottom: 8}}>Hình quảng cáo*</Typography>
                                {this.state.imgAd && this.isEditProduct && <img style={{width: 300, borderRadius: 2, marginBottom: 8, height: 400}} src={`${config.imageURL}/${this.state.imgAd}`} alt='current_image_ad'/>}
                                {/*<Typography style={{marginBottom: 8}}>{this.isEditProduct ? 'Chọn hình khác để thay đổi' : 'Xin chọn hình'}</Typography>*/}
                                <UploadImageButton nameFile={'adImg'} config={config} handleUploadImage={(event) => this.handleUploadImage('adImg', event)} handleDeleteImage={() => this.handleDeleteImage('adImg')} imgFile={this.state.adImg} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography style={{marginBottom: 8}}>Hình đơn vị*</Typography>
                                {this.state.imgUnit && this.isEditProduct && <img style={{width: 300, borderRadius: 2, marginBottom: 8, height: 400}} src={`${config.imageURL}/${this.state.imgUnit}`} alt='current_image_unit'/>}
                                {/*<Typography style={{marginBottom: 8}}>{this.isEditProduct ? 'Chọn hình khác để thay đổi' : 'Xin chọn hình'}</Typography>*/}
                                <UploadImageButton nameFile={'unitImg'} config={config} handleUploadImage={(event) => this.handleUploadImage('unitImg', event)} handleDeleteImage={() => this.handleDeleteImage('unitImg')} imgFile={this.state.unitImg} />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <TextField
                                        required
                                        label='Lời giới thiệu'
                                        name='product_intro'
                                        onChange={this.handleChange}
                                        value={this.state.product_intro}
                                        multiline
                                        InputLabelProps={{shrink: true}}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {/* Introduction content */}
                <ExpansionPanel elevation={4} defaultExpanded={false}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls='panel2a-content'
                        id='panel2a-header'
                    >
                        <BookIcon className={'primary-color'}/> &nbsp; <Typography>Mô tả</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <FormControl>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        label='Tiêu đề'
                                        name='introduction_title'
                                        onChange={this.handleChange}
                                        InputLabelProps={{shrink: true}}
                                        value={this.state.introduction_title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <TextField
                                            required
                                            label='Nhập nội dung miêu tả'
                                            name='introduction_detail'
                                            onChange={this.handleChange}
                                            value={this.state.introduction_detail}
                                            multiline
                                            InputLabelProps={{shrink: true}}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography component={'h6'} style={{marginBottom: 8}}>Hình minh họa*</Typography>
                                    {this.state.introduction_imgIntro && this.isEditProduct && <img style={{width: 300, borderRadius: 2, marginBottom: 8}} src={`${config.imageURL}/${this.state.introduction_imgIntro}`} alt='current_image_intro'/>}
                                    {/*<Typography style={{marginBottom: 8}}>{this.isEditProduct ? 'Chọn hình khác để thay đổi' : 'Xin chọn hình'}</Typography>*/}
                                    <UploadImageButton nameFile={'introImg'} config={config} handleUploadImage={(event) => this.handleUploadImage('introImg', event)} handleDeleteImage={() => this.handleDeleteImage('introImg')} imgFile={this.state.introImg} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        alignItems='flex-start'
                                        spacing={2}
                                    >
                                        <Grid item xs={12}><Typography>Thuộc tính sản phẩm: </Typography></Grid>
                                        <Grid item xs={12}>
                                            <Table className='source-display-table'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{width: 'calc(85%/2)'}}
                                                                   className='overflow-text'>{resource.meta_key1}</TableCell>
                                                        <TableCell style={{width: 'calc(85%/2)'}}
                                                                   className='overflow-text'>{resource.meta_value1}</TableCell>
                                                        <TableCell style={{width: '50px'}} className='overflow-text'/>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.entries(this.state.introduction_ingredientInfo).map((entry, index) => (
                                                        <TableRow key={entry[0] + entry[1]}>
                                                            <TableCell className='overflow-text'>
                                                                {entry[0]}
                                                            </TableCell>
                                                            <TableCell className='overflow-text'>{entry[1]}</TableCell>
                                                            <TableCell className='overflow-text'><Tooltip
                                                                title={resource.delete_key}>
                                                                <IconButton
                                                                    onClick={() => this.handleDeleteIntroIngredient(entry[0])}>
                                                                    <RemoveCircleOutlineIcon/>
                                                                </IconButton>
                                                            </Tooltip></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {
                                                        Object.entries(this.state.introduction_ingredientInfo).length < 1 &&
                                                        <TableRow>
                                                            <TableCell align='center' colSpan={3}>
                                                                {resource.no_meta_data}
                                                            </TableCell>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        justify='center'
                                        alignItems='center'
                                        spacing={2}
                                    >
                                        <Grid item style={{width: '100%'}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <TextField
                                                        label={resource.meta_key}
                                                        InputLabelProps={{shrink: true}}
                                                        name='intro_ingredient_key'
                                                        onChange={this.handleChange}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <TextField
                                                        label={resource.meta_value}
                                                        InputLabelProps={{shrink: true}}
                                                        name='intro_ingredient_value'
                                                        onChange={this.handleChange}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item style={{width: 78}}>
                                            <Tooltip title={resource.add1}>
                                                <Button variant='outlined' className='text-btn'
                                                        onClick={() => this.handleAddIntroIngredient()} size='small'
                                                        color='primary'>{resource.add1}</Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Ghi chú'
                                        name='introduction_note'
                                        onChange={this.handleChange}
                                        InputLabelProps={{shrink: true}}
                                        value={this.state.introduction_note}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {/* Ingredient content */}
                <ExpansionPanel elevation={4} defaultExpanded={false}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls='panel3a-content'
                        id='panel3a-header'
                    >
                        <ReceiptIcon className={'primary-color'}/> &nbsp; <Typography>Thành phần</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <FormControl>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Tiêu đề'
                                        name='ingredient_title'
                                        onChange={this.handleChange}
                                        InputLabelProps={{shrink: true}}
                                        value={this.state.ingredient_title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <TextField
                                            label='Mô tả thành phần'
                                            name='ingredient_detail'
                                            onChange={this.handleChange}
                                            value={this.state.ingredient_detail}
                                            InputLabelProps={{shrink: true}}
                                            multiline
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography style={{marginBottom: 8}}>Hình ảnh minh họa thành phần*</Typography>
                                    {this.state.ingredient_image && this.isEditProduct && <img style={{width: 300, borderRadius: 2, marginBottom: 8}} src={`${config.imageURL}/${this.state.ingredient_image}`} alt='current_image_ingredient'/>}
                                    {/*<Typography style={{marginBottom: 8}}>{this.isEditProduct ? 'Chọn hình khác để thay đổi' : 'Xin chọn hình'}</Typography>*/}
                                    <UploadImageButton nameFile={'ingredientImg'} config={config} handleUploadImage={(event) => this.handleUploadImage('ingredientImg', event)} handleDeleteImage={() => this.handleDeleteImage('ingredientImg')} imgFile={this.state.ingredientImg} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        alignItems='flex-start'
                                        spacing={2}
                                    >
                                        <Grid item xs={12}><Typography>Thuộc tính sản phẩm: </Typography></Grid>
                                        <Grid item xs={12}>
                                            <Table className='source-display-table'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{width: 'calc(85%/2)'}}
                                                                   className='overflow-text'>{resource.meta_key1}</TableCell>
                                                        <TableCell style={{width: 'calc(85%/2)'}}
                                                                   className='overflow-text'>{resource.meta_value1}</TableCell>
                                                        <TableCell style={{width: '50px'}} className='overflow-text'/>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.entries(this.state.ingredient_info).map((entry, index) => (
                                                        <TableRow key={entry[0] + entry[1]}>
                                                            <TableCell className='overflow-text'>
                                                                {entry[0]}
                                                            </TableCell>
                                                            <TableCell className='overflow-text'>{entry[1]}</TableCell>
                                                            <TableCell className='overflow-text'><Tooltip
                                                                title={resource.delete_key}>
                                                                <IconButton
                                                                    onClick={() => this.handleDeleteIngredient(entry[0])}>
                                                                    <RemoveCircleOutlineIcon/>
                                                                </IconButton>
                                                            </Tooltip></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {
                                                        Object.entries(this.state.ingredient_info).length < 1 &&
                                                        <TableRow>
                                                            <TableCell align='center' colSpan={3}>
                                                                {resource.no_meta_data}
                                                            </TableCell>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        justify='center'
                                        alignItems='center'
                                        spacing={2}
                                    >
                                        <Grid item style={{width: '100%'}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <TextField
                                                        label={resource.meta_key}
                                                        name='ingredient_key'
                                                        onChange={this.handleChange}
                                                        InputLabelProps={{shrink: true}}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <TextField
                                                        label={resource.meta_value}
                                                        name='ingredient_value'
                                                        onChange={this.handleChange}
                                                        InputLabelProps={{shrink: true}}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item style={{width: 78}}>
                                            <Tooltip title={resource.add1}>
                                                <Button variant='outlined' className='text-btn'
                                                        onClick={() => this.handleAddIngredient()} size='small'
                                                        color='primary'>{resource.add1}</Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Ghi chú'
                                        name='ingredient_note'
                                        onChange={this.handleChange}
                                        InputLabelProps={{shrink: true}}
                                        value={this.state.ingredient_note}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Dialog
                    open={this.state.resultDialogOpen}
                    onClose={() => this.handleCloseResultDialog(this.state.isAddOrUpdateSuccess)}
                    aria-labelledby='info-dialog-title'
                    aria-describedby='info-dialog-description'
                >
                    <DialogTitle style={{textAlign: 'center'}}
                                 id='alert-dialog-title'>{this.state.isAddOrUpdateSuccess ?
                        <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                        <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                    <DialogContent>
                        {this.state.isAddOrUpdateSuccess && (
                            <DialogContentText id='info-dialog-description'>
                                {this.isEditProduct ? 'Sửa sản phẩm thành công!' : 'Thêm sản phẩm thành công!'}
                            </DialogContentText>
                        )}
                        {!this.state.isAddOrUpdateSuccess && (
                            <DialogContentText id='info-dialog-description'>
                                {this.isEditProduct ? 'Không sửa được sản phẩm!' : 'Không thêm được sản phẩm!'}
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.handleCloseResultDialog(this.state.isAddOrUpdateSuccess)}
                            color='primary'
                            autoFocus
                        >
                            {resource.ok}
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>;
    }

    uploadImage = () => {
        if (this.state.adImg.length > 0) {
            this.productService.uploadImg(this.state.adImg[0]).subscribe(res => {
                if (res !== 'error') {
                }
            });
        }
        if (this.state.unitImg.length > 0) {
            this.productService.uploadImg(this.state.unitImg[0]).subscribe(res => {
                if (res !== 'error') {
                }
            });
        }
        if (this.state.introImg.length > 0) {
            this.productService.uploadImg(this.state.introImg[0]).subscribe(res => {
                if (res !== 'error') {
                }
            });
        }
        if (this.state.ingredientImg.length > 0) {
            this.productService.uploadImg(this.state.ingredientImg[0]).subscribe(res => {
                if (res !== 'error') {
                }
            });
        }
    }

    getImagesName(image: string) {
        if (image === 'imgAd') {
            if (this.state.adImg.length > 0) {
                this.setState({imgAd: `${this.state.adImg[0].name}`});
                return `${this.state.adImg[0].name}`;
            }
            return this.imgAd;
        }
        if (image === 'imgUnit') {
            if (this.state.unitImg.length > 0) {
                this.setState({imgUnit: `${this.state.unitImg[0].name}`});
                return `${this.state.unitImg[0].name}`;
            }
            return this.imgUnit;
        }
        if (image === 'introduction_imgIntro') {
            if (this.state.introImg.length > 0) {
                this.setState({introduction_imgIntro: `${this.state.introImg[0].name}`});
                return `${this.state.introImg[0].name}`;
            }
            return this.introduction_imgIntro;
        }
        if (image === 'ingredient_image') {
            if (this.state.ingredientImg.length > 0) {
                this.setState({ingredient_image: `${this.state.ingredientImg[0].name}`});
                return `${this.state.ingredientImg[0].name}`;
            }
            return this.ingredient_image;
        }
        return '';
    }

    save = () => {
        const request = {
            productId: this.isEditProduct ? this.state.productId : this.generateUUID(),
            name: this.state.productName,
            status: +this.state.status,
            imageAds: this.getImagesName('imgAd'),
            imageUnit: this.getImagesName('imgUnit'),
            introduction: this.state.product_intro,
            introductionDescriptions: [
                {
                    title: this.state.introduction_title,
                    description: this.state.introduction_detail,
                    images: [
                        this.getImagesName('introduction_imgIntro')
                    ],
                    attributes: [
                        ...Object.keys(this.state.introduction_ingredientInfo).map(key => ({
                            name: key,
                            value: this.state.introduction_ingredientInfo[key]
                        }))
                    ],
                    notes: [
                        this.state.introduction_note
                    ]
                }
            ],
            ingredientDescriptions: [
                {
                    title: this.state.ingredient_title,
                    description: this.state.ingredient_detail,
                    images: [
                        this.getImagesName('ingredient_image')
                    ],
                    attributes: [
                        ...Object.keys(this.state.ingredient_info).map(key => ({
                            name: key,
                            value: this.state.ingredient_info[key]
                        }))
                    ],
                    notes: [
                        this.state.ingredient_note
                    ]
                }
            ],
            organizationId: this.providerId
        };
        if (this.isEditProduct) {
            this.productService.updateProduct(request).subscribe(res => {
                if (res !== 'error') {
                    this.setState({resultDialogOpen: true, isAddOrUpdateSuccess: true});
                } else {
                    this.setState({resultDialogOpen: true, isAddOrUpdateSuccess: false});
                }
            });
        } else {
            this.productService.insertProduct(request).subscribe(res => {
                if (res !== 'error') {
                    this.setState({resultDialogOpen: true, isAddOrUpdateSuccess: true});
                } else {
                    this.setState({resultDialogOpen: true, isAddOrUpdateSuccess: false});
                }
            });
        }
    }
    onSave = () => {
        this.validateFields();
        this.uploadImage();
        this.save();
    }

    validateFields = () => {

    }

    generateUUID = () => {
        return StringUtil.uuid(uuidv4);
    }
}
