import * as React from 'react';
import {
    Backdrop,
    Button, Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider, Fade, FormControl, Grid, IconButton, InputLabel, MenuItem, Modal,
    Paper, Select,
    Table,
    TableBody,
    TableCell, TableHead,
    TableRow, TextareaAutosize, TextField, Tooltip,
    Typography
} from '@material-ui/core';
import config from '../../../config';
import applicationContext from '../../config/ApplicationContext';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import {ResourceManager} from '../../../common/ResourceManager';
import './provider-edit-ad-modal.scss';
import {UploadImageButton} from '../common/uploadImageButton';

export class ProviderEditAdInfoModal extends React.Component<any, any> {
    private readonly productService = applicationContext.getProductService();
    private readonly providerService = applicationContext.getProviderService();
    private isAddAdMode: boolean;
    constructor(props) {
        super(props);
        this.isAddAdMode = this.props.isAddNewAd;
        this.state = {
            title: '',
            description: '',
            images: [],
            attributes: [],
            notes: [],
            imgFile: [],
            // ad_key: '',
            // ad_value: '',
            image: '',
            note: '',
            listAdProducts: [
                // {
                //     file: [],
                //     productName: ''
                // }
            ],
            adProductImgFile: []
        };
    }

    componentDidMount(): void {
        this.mapPropsToState();
    }

    mapPropsToState = () => {
        let listAdProducts = [];
        listAdProducts = this.props.ad.attributes.map((item => ({
            file: item.value,
            productName: item.name
        })));
        const note = this.props.ad.notes[0] || '';
        const image = this.props.ad.images[0] || '';
        this.setState({
            ...this.state,
            ...this.props.ad,
            listAdProducts,
            note,
            image
        });
    }

    getCommonDropZoneProps() {
        return {
            acceptedFiles: ['image/*'],
            filesLimit: 1,
            maxFileSize: 3145728,
            dropzoneText: '',
            showPreviews: false,
            showFileNames: false
        };
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
        const fileName = files.length > 0 ? `ad.${this.getFileExtension(files[0].name)}` : this.state.image;
        const filePath = `organization/${this.props.providerData['_id']}`;
        this.setState({imgFile: files, image: `${filePath}/${fileName}`}, () => {
            if (this.state.imgFile.length > 0) {
                this.productService.uploadImg(this.state.imgFile[0], fileName, filePath).subscribe(res => {
                    if (res !== 'error') {
                    }
                });
            }
        });
    }
    handleDeleteImage = (event) => {
        this.setState({imgFile: []});
    }
    handleUploadAdProductImage = (event) => {
        const {files} = event.target;
        this.setState({adProductImgFile: files}, () => {
            if (this.state.adProductImgFile.length > 0) {
                const fileName = `adProduct.${this.getFileExtension(this.state.adProductImgFile[0].name)}`;
                const filePath = `organization/${this.props.providerData['_id']}`;
                this.productService.uploadImg(this.state.adProductImgFile[0], fileName, filePath).subscribe(res => {
                    if (res !== 'error') {
                    }
                });
            }
        });

    }
    handleDeleteAdProductImage = (event) => {
        this.setState({adProductImgFile: []});
    }
    handleSave = () => {
        const clone_state = {...this.state};
        delete clone_state['ad_key'];
        delete clone_state['ad_value'];
        delete clone_state['image'];
        delete clone_state['imgFile'];
        delete clone_state['note'];
        delete clone_state['listAdProducts'];
        delete clone_state['adProductImgFile'];
        const images = [this.state.image];
        const notes = [this.state.note];
        const attributes = this.state.listAdProducts.map(item => ({name: item.productName, value: typeof item.file === 'string' ? item.file : item.file[0].name}));

        const {adsDescriptions} = this.props.providerData;
        adsDescriptions[this.props.index] = {...clone_state, images, attributes, notes};
        const bodyData = {
            ...this.props.providerData,
            adsDescriptions,
            organizationId: this.props.providerData['_id'],
        };
        delete bodyData['_id'];
        this.providerService.updateProviderInfo(this.props.providerData['_id'], bodyData).subscribe(res => {
            if (res !== 'error') {
                this.props.onClose();
            }
        });
    }

    render() {
        const resource = ResourceManager.getResource();
        return <div>
            <form>
                <Card elevation={4} className={'provider-ad-info'}>
                    <CardHeader title={<Typography style={{fontWeight: 'bold'}}>
                        {this.isAddAdMode ? `Thêm thông tin quảng cáo` : `Chỉnh sửa thông tin quảng cáo`}</Typography>}/>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl> <TextField
                                    label='Tựa đề quảng cáo'
                                    variant='outlined'
                                    type='text'
                                    fullWidth
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    name='title'
                                /></FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <TextField
                                        label='Mô tả'
                                        variant='outlined'
                                        type='text'
                                        fullWidth
                                        name='description'
                                        onChange={this.handleChange}
                                        value={this.state.description}
                                        multiline
                                    />
                                </FormControl>
                            </Grid>
                                <Grid item xs={12}>
                                    <Typography style={{borderRadius: 2, marginBottom: 8}}>Hình ảnh:</Typography>
                                    {this.state.image && <img style={{borderRadius: 2, marginBottom: 8, display: 'block', width: 300}}
                                         src={`${config.imageURL}/${this.state.image}`} alt='current_image_ad'/>}
                                    <UploadImageButton nameFile={'upload-product-ad-primary'} config={config} handleUploadImage={this.handleUploadImage} handleDeleteImage={this.handleDeleteImage} imgFile={this.state.imgFile} />
                                </Grid>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    alignItems='flex-start'
                                    spacing={2}
                                >
                                    <Grid item xs={12}><Typography>Thông tin quảng cáo: </Typography></Grid>
                                    <Grid item xs={12}>
                                        <Paper elevation={4}>
                                            <Table className='source-display-table'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Tên sản phẩm
                                                        </TableCell>
                                                        <TableCell>
                                                            Hình ảnh
                                                        </TableCell>
                                                        <TableCell>
                                                            Xóa
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.listAdProducts.map((item, index) => (
                                                        <TableRow key={item.productName}>
                                                            <TableCell className='overflow-text'>
                                                                {item.productName}
                                                            </TableCell>
                                                            <TableCell className='overflow-text'>
                                                                <img style={{borderRadius: 2, width: 128, height: 128}}
                                                                     src={`${config.imageURL}/${typeof item.file === 'string' ? item.file : item.file[0].name}`} alt='current_image_ad'/>
                                                            </TableCell>
                                                            <TableCell className='overflow-text'><Tooltip
                                                                title={resource.delete_key}>
                                                                <IconButton
                                                                    onClick={() => this.handleDeleteAdInfo(item)}>
                                                                    <RemoveCircleOutlineIcon/>
                                                                </IconButton>
                                                            </Tooltip></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {
                                                        this.state.listAdProducts.length < 1 &&
                                                        <TableRow>
                                                            <TableCell align='center' colSpan={3}>
                                                                {resource.no_meta_data}
                                                            </TableCell>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={4} style={{padding: 16}}>
                                    <Grid
                                        container
                                        justify='center'
                                        alignItems='center'
                                        spacing={2}
                                    >
                                        <Grid item xs={6}>
                                            <TextField
                                                label={'Nhập tên sản phẩm'}
                                                name='ad_key'
                                                onChange={this.handleChange}
                                                InputLabelProps={{shrink: true}}
                                                required
                                                fullWidth
                                                variant='outlined'
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <UploadImageButton nameFile={'upload-product-ad-secondary'} config={config}
                                                               handleUploadImage={this.handleUploadAdProductImage}
                                                               handleDeleteImage={this.handleDeleteAdProductImage}
                                                               imgFile={this.state.adProductImgFile}/>
                                            <Button variant='outlined' className='text-btn'
                                                    onClick={() => this.handleAddAdInfo()} size='small'
                                                    color='primary'>{resource.add1}</Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl> <TextField
                                    label='Ghi chú'
                                    variant='outlined'
                                    type='text'
                                    fullWidth
                                    value={this.state.note}
                                    onChange={this.handleChange}
                                    name='note'
                                    multiline
                                /></FormControl>
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
        </div>;
    }

    handleAddAdInfo = () => {
        if (!this.state.ad_key || ! (this.state.adProductImgFile.length > 0)) {
            return;
        }
        const listAdProducts = [...this.state.listAdProducts];
        const find = listAdProducts.find(item => item.productName === this.state.ad_key);
        if (find) { return; }
        const adProductName = `organization/${this.props.providerData['_id']}/adProduct.${this.getFileExtension(this.state.adProductImgFile[0].name)}`;
        listAdProducts.push({file: adProductName, productName: this.state.ad_key});
        this.setState({listAdProducts});
    }

    handleDeleteAdInfo = (itemDelete) => {
        const listAdProducts = [...this.state.listAdProducts];
        const newArr = listAdProducts.filter(item => item.productName !== itemDelete.productName);
        this.setState({listAdProducts: newArr});
    }

    getFileExtension(fileName: string) {
        return fileName.split('.').pop();
    }
}
