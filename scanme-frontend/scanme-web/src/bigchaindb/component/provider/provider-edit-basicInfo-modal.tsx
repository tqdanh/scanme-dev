import * as React from 'react';
import {
    Backdrop,
    Button, Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider, Fade, FormControl, Grid, InputLabel, MenuItem, Modal,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableRow, TextField,
    Typography
} from '@material-ui/core';
import config from '../../../config';
import {ProviderEditAddressModal} from './provider-edit-address-modal';
import applicationContext from '../../config/ApplicationContext';
import {UploadImageButton} from '../common/uploadImageButton';
import MarkerIcon from '@material-ui/icons/Room';
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
        width: '60%'
    }
};

export class ProviderEditBasicInfoModal extends React.Component<any, any> {
    private readonly productService = applicationContext.getProductService();
    private readonly providerService = applicationContext.getProviderService();

    constructor(props) {
        super(props);
        this.state = {
            isOpenEditProviderAddressModal: false,
            organizationName: '',
            organizationType: '',
            organizationAddress: '',
            organizationPhone: '',
            email: '',
            description: '',
            certificate: '',
            imageUrl: '',
            imgFile: [],
            location: []
        };
    }

    componentDidMount(): void {
        this.mapPropsToState();
    }

    mapPropsToState = () => {
        this.setState({...this.state, ...this.props.providerData});
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

    handleEditAddress = (e) => {
        e.preventDefault();
        this.setState({isOpenEditProviderAddressModal: true});
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
        const {files} = event.target;
        this.setState({
            imgFile: files,
            imageUrl: files.length > 0 ? `${files[0].name}` : this.state.imageUrl
        }, () => {
            if (this.state.imgFile.length > 0) {
                this.productService.uploadImg(this.state.imgFile[0]).subscribe(res => {
                    if (res !== 'error') {
                    }
                });
            }
        });
    }
    handleDeleteImage = (event) => {
        this.setState({imgFile: []});
    }
    handleSave = () => {
        const clone_state = {...this.state};
        clone_state['organizationId'] = clone_state['_id'];
        delete clone_state['isOpenEditProviderAddressModal'];
        delete clone_state['imgFile'];
        delete clone_state['_id'];
        const imageUrl = this.state.imageUrl;
        this.providerService.updateProviderInfo(this.state._id, {...clone_state, imageUrl}).subscribe(res => {
            if (res !== 'error') {
                this.props.onClose();
            }
        });
    }
    handleCloseAddressModal = (locationData?) => {
        this.setState({isOpenEditProviderAddressModal: false});
        if (locationData) {
            this.setState({
                organizationAddress: locationData.selectedLocationName,
                location: [`${locationData.coordinates.lat}`, `${locationData.coordinates.lng}`]
            });
        }
    }

    render() {
        return <div>
            <form>
                <Card elevation={4} className={'provider-info-table'}>
                    <CardHeader title={<Typography style={{fontWeight: 'bold'}}>
                        {`Chỉnh sửa thông tin doanh nghiệp`}</Typography>}/>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl> <TextField
                                    label='Tên doanh nghiệp'
                                    variant='outlined'
                                    type='text'
                                    fullWidth
                                    value={this.state.organizationName}
                                    onChange={this.handleChange}
                                    name='organizationName'
                                /></FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant='outlined'>
                                    <InputLabel htmlFor='provider-type-select' id='label'>
                                        Loại doanh nghiệp
                                    </InputLabel>
                                    <Select
                                        labelId='label'
                                        id='provider-type-select'
                                        value={this.state.organizationType}
                                        labelWidth={130}
                                        onChange={this.handleChange}
                                        name='organizationType'
                                    >
                                        <MenuItem value={'farmer'}>Nông trường</MenuItem>
                                        <MenuItem value={'producer'}>Nhà sản xuất</MenuItem>
                                        <MenuItem value={'distributor'}>Nhà phân phối</MenuItem>
                                        <MenuItem value={'retailer'}>Nhà bán lẻ</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='Địa chỉ'
                                        variant='outlined'
                                        type='text'
                                        fullWidth
                                        value={this.state.organizationAddress}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        onChange={this.handleChange}
                                        name='organizationAddress'
                                    />
                                    <a onClick={this.handleEditAddress} style={{textAlign: 'right'}}><MarkerIcon/> Chỉnh sửa vị
                                        trí...</a>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='SĐT'
                                        variant='outlined'
                                        type='tel'
                                        fullWidth
                                        value={this.state.organizationPhone}
                                        onChange={this.handleChange}
                                        name='organizationPhone'
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='Email'
                                        variant='outlined'
                                        type='email'
                                        fullWidth
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        name='email'
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='Mô tả'
                                        variant='outlined'
                                        type='text'
                                        fullWidth
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                        name='description'
                                        multiline
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <TextField
                                        label='Chứng nhận'
                                        variant='outlined'
                                        type='text'
                                        fullWidth
                                        value={this.state.certificate}
                                        onChange={this.handleChange}
                                        name='certificate'
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{borderRadius: 2, marginBottom: 8}}>Hình đại diện doanh
                                    nghiệp:</Typography>
                                <img style={{borderRadius: 2, marginBottom: 8, display: 'block', width: 300}}
                                     src={`${config.imageURL}/${this.state.imageUrl}`} alt='current_image_ad'/>
                                <UploadImageButton nameFile={'upload-provider-image'} config={config} handleUploadImage={this.handleUploadImage} handleDeleteImage={this.handleDeleteImage} imgFile={this.state.imgFile} />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider/>
                    <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => this.props.onClose()} size='small' variant='contained'>Đóng</Button>
                        <Button color='primary' onClick={() => this.handleSave()} size='small' variant='contained'>
                            Lưu </Button>
                    </CardActions>
                </Card>
            </form>
            <Modal
                className='custom-modal-provider-address-picker'
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                style={commonModalStyle.modal}
                open={this.state.isOpenEditProviderAddressModal}
                onClose={() => this.setState({isOpenEditProviderAddressModal: false})}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.isOpenEditProviderAddressModal}>
                    <div style={{...commonModalStyle.paper}}>
                        <ProviderEditAddressModal
                            onClose={this.handleCloseAddressModal}
                            cordinates={this.state.location}
                            providerAddress={this.state.organizationAddress}
                            providerImageUrl={this.state.imageUrl}/>
                    </div>
                </Fade>
            </Modal>
        </div>;
    }
}
