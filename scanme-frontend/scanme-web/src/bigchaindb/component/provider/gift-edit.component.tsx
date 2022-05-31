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
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { ResourceManager } from '../../../common/ResourceManager';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import BookIcon from '@material-ui/icons/BookOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import applicationContext from '../../config/ApplicationContext';
import { StringUtil } from '../../../common/util/StringUtil';
import * as uuidv4 from 'uuid/v4';
import { storage } from '../../../common/storage';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import config from '../../../config';
import { UploadImageButton } from '../common/uploadImageButton';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as moment from 'moment';

export class AddEditGiftForm extends React.Component<any, any> {
    providerId = storage.getProviderIdOfUser() || '';
    isEditGift: boolean;
    private readonly organizationService = applicationContext.getOrganizationService();
    private readonly productService = applicationContext.getProductService();

    constructor(props) {
        super(props);
        this.isEditGift = this.props.props.match.path === '/gift/:id/edit';
        this.state = {
            name: '',
            image: '',
            expiryDate: moment(new Date()).add(3, 'months').toDate(),
            quantity: '',
            point: '',
            imgArray: [],
            returnedGift: {},
            isAddOrUpdateSuccess: false,
            resultDialogOpen: false
        };
    }

    mapGiftToState(model: any) {
        if (model) {
            this.setState({
                id: model._id,
                name: model.name,
                image: model.image,
                expiryDate: moment(model.expiryDate).toDate(),
                quantity: model.quantity,
                point: model.point
            });
        }
    }

    componentDidMount = () => {
        if (this.isEditGift) {
            const giftId = this.props.props.match.params.id;
            this.organizationService.getGiftById(giftId, this.providerId).subscribe(res => {
                if (res !== 'error') {
                    this.setState({ returnedGift: res.results[0] }, () => this.mapGiftToState(this.state.returnedGift));
                }
            });
        } else {
            this.setState({ id: this.generateUUID() });
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

    handleUploadImage = (event) => {
        const { files } = event.target;
        if (files.length <= 0) {
            return;
        }
        const fileName = `gift.${this.getFileExtension(files[0].name)}`;
        const filePath = `gift/${this.state.id}`;
        this.setState({ imgArray: files, image: `${filePath}/${fileName}` }, () => {
            if (this.state.imgArray.length > 0) {
                this.productService.uploadImg(this.state.imgArray[0], fileName, filePath).subscribe(res => {
                    if (res !== 'error') {
                    }
                });
            }
        });
    }

    handleDeleteImage = () => {
        this.setState({ imgArray: [] });
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

    handleCloseResultDialog = (isAddSuccess) => {
        this.setState({ resultDialogOpen: false }, () => {
            // this.searchModelByPageIndexAndPageSize(); // reload page
        });
    }

    render() {
        const resource = ResourceManager.getResource();
        return <div style={{ padding: 16 }}>
            <header className='add-gift-page-header'
                style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Typography component='h4' variant='h4'
                    style={{ width: 'fit-content' }}>{!this.isEditGift ? 'Thêm quà tặng' : 'Chỉnh sửa quà tặng'}<Button
                        onClick={() => this.props.history.push('/gift')} className='text-btn'
                        color='secondary'><ArrowBackIcon />  &nbsp; Quay
                        lại</Button>
                </Typography>
                <div className='actions-btn'>
                    <Button onClick={() => this.onSave()}
                        variant='contained' size='small'
                        color='primary'><SaveIcon /> &nbsp; {!this.isEditGift ? 'Thêm quà tặng' : 'Lưu'}</Button>
                </div>

            </header>
            <main>
                {/* Basic Info content */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl>
                            <TextField
                                required
                                name='name'
                                label='Tên quà tặng'
                                onChange={this.handleChange}
                                InputLabelProps={{ shrink: true }}
                                value={this.state.name}
                                variant='outlined'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ marginBottom: 8 }}>Hình quà tặng*</Typography>
                        {this.state.image && this.isEditGift &&
                            <img style={{ width: 300, borderRadius: 2, marginBottom: 8 }}
                                src={`${config.imageURL}/${this.state.image}`} alt='current_image_gift' />}
                        <UploadImageButton nameFile={'giftImg'} config={config}
                            handleUploadImage={(event) => this.handleUploadImage(event)}
                            handleDeleteImage={() => this.handleDeleteImage()}
                            imgFile={this.state.imgArray} />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                autoOk
                                disableToolbar
                                format='MM/dd/yyyy'
                                label={resource.exp_date}
                                value={this.state.expiryDate}
                                onChange={(newDate) => this.setState({
                                    expiryDate: newDate
                                })}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                InputLabelProps={{ shrink: true }}
                                required
                                variant='inline'
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <TextField
                                required
                                type='number'
                                name='quantity'
                                label='Số lượng'
                                onChange={this.handleChange}
                                InputLabelProps={{ shrink: true }}
                                value={this.state.quantity}
                                variant='outlined'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <TextField
                                required
                                type='number'
                                name='point'
                                label='Điểm'
                                onChange={this.handleChange}
                                InputLabelProps={{ shrink: true }}
                                value={this.state.point}
                                variant='outlined'
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Dialog
                    open={this.state.resultDialogOpen}
                    onClose={() => this.handleCloseResultDialog(this.state.isAddOrUpdateSuccess)}
                    aria-labelledby='info-dialog-title'
                    aria-describedby='info-dialog-description'
                >
                    <DialogTitle style={{ textAlign: 'center' }}
                        id='alert-dialog-title'>{this.state.isAddOrUpdateSuccess ?
                            <DoneIcon style={{ fontSize: 64 }} className='dialog-icon-success' /> :
                            <ClearOutlineIcon style={{ fontSize: 64 }} className='dialog-icon-fail' />}</DialogTitle>
                    <DialogContent>
                        {this.state.isAddOrUpdateSuccess && (
                            <DialogContentText id='info-dialog-description'>
                                {this.isEditGift ? 'Sửa quà tặng thành công!' : 'Thêm quà tặng thành công!'}
                            </DialogContentText>
                        )}
                        {!this.state.isAddOrUpdateSuccess && (
                            <DialogContentText id='info-dialog-description'>
                                {this.isEditGift ? 'Không sửa được quà tặng!' : 'Không thêm được quà tặng!'}
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

    save = () => {
        const request = {
            giftId: this.state.id,
            name: this.state.name,
            image: this.state.image,
            expiryDate: moment(this.state.expiryDate).format('YYYY-MM-DD'),
            quantity: +this.state.quantity,
            point: +this.state.point,
            orgId: this.providerId
        };
        if (this.isEditGift) {
            this.organizationService.updateGift(request.giftId, request).subscribe(res => {
                if (res !== 'error') {
                    this.setState({ resultDialogOpen: true, isAddOrUpdateSuccess: true });
                } else {
                    this.setState({ resultDialogOpen: true, isAddOrUpdateSuccess: false });
                }
            });
        } else {
            this.organizationService.insertGift(request).subscribe(res => {
                if (res !== 'error') {
                    this.setState({ resultDialogOpen: true, isAddOrUpdateSuccess: true });
                } else {
                    this.setState({ resultDialogOpen: true, isAddOrUpdateSuccess: false });
                }
            });
        }
    }
    onSave = () => {
        this.validateFields();
        // this.uploadImage();
        this.save();
    }

    validateFields = () => {

    }

    generateUUID = () => {
        return StringUtil.uuid(uuidv4);
    }

    getFileExtension(fileName: string) {
        return fileName.split('.').pop();
    }
}
