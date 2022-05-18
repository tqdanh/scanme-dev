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
import {UploadImageButton} from '../common/uploadImageButton';

export class ProviderEditPromotionInfoModal extends React.Component<any, any> {
    private readonly productService = applicationContext.getProductService();
    private readonly providerService = applicationContext.getProviderService();
    private isAddPromotionMode: boolean;
    constructor(props) {
        super(props);
        this.isAddPromotionMode = this.props.isAddNewPromotion;
        this.state = {
            title: '',
            description: '',
            images: [],
            attributes: [],
            notes: [],

            imgFile: [],
            promotion_key: '',
            promotion_value: '',
            promotionInfo: {},
            image: '',
            note: ''
        };
    }

    componentDidMount(): void {
        this.mapPropsToState();
    }

    mapPropsToState = () => {
        let promotionInfo = {};
        this.props.promotion.attributes.forEach((item => {
            promotionInfo = Object.assign(promotionInfo, {[item.name]: item.value});
        }));
        const note = this.props.promotion.notes[0] || '';
        const image = this.props.promotion.images[0] || '';
        this.setState({
            ...this.state,
            ...this.props.promotion,
            promotionInfo,
            note,
            image
        });
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
        this.setState({imgFile: files, image: files.length > 0 ? `${files[0].name}` : this.state.image}, () => {
            if (this.state.imgFile.length > 0) {
                this.productService.uploadImg(this.state.imgFile[0]).subscribe(res => {
                    if (res !== 'error') {
                    }
                });
            }
        });
    }
    handleDeleteImage = event => {
        this.setState({imgFile: []});
    }

    handleSave = () => {
        // if (this.state.imgFile.length > 0) {
        //     this.productService.uploadImg(this.state.imgFile[0]).subscribe(res => {
        //         if (res !== 'error') {
        //         }
        //     });
        // }
        const clone_state = {...this.state};
        delete clone_state['promotion_key'];
        delete clone_state['promotion_value'];
        delete clone_state['promotionInfo'];
        delete clone_state['image'];
        delete clone_state['imgFile'];
        delete clone_state['note'];
        const images = [this.state.image];
        const notes = [this.state.note];
        const attributes = Object.entries(this.state.promotionInfo).map(entry => ({name: entry[0], value: entry[1]}));

        const {promotionDescriptions} = this.props.providerData;
        promotionDescriptions[this.props.index] = {...clone_state, images, attributes, notes};

        const bodyData = {
            ...this.props.providerData,
            promotionDescriptions,
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
                <Card elevation={4} className={'provider-promotion-info'}>
                    <CardHeader title={<Typography style={{fontWeight: 'bold'}}>
                        {this.isAddPromotionMode ? `Thêm thông tin khuyến mãi` : `Chỉnh sửa thông tin khuyến mãi`}</Typography>}/>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl> <TextField
                                    label='Tựa đề khuyến mãi'
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
                                    <Typography style={{borderRadius: 2, marginBottom: 8}}>Hình ảnh khuyến
                                        mãi:</Typography>
                                    {this.state.image && <img style={{borderRadius: 2, marginBottom: 8, display: 'block', width: 300}}
                                         src={`${config.imageURL}/${this.state.image}`} alt='current_image_promotion'/>}
                                    <UploadImageButton nameFile={'upload-product-promotion'} config={config} handleUploadImage={this.handleUploadImage} handleDeleteImage={this.handleDeleteImage} imgFile={this.state.imgFile} />
                                </Grid>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    alignItems='flex-start'
                                    spacing={2}
                                >
                                    <Grid item xs={12}><Typography>Thông tin khuyến mãi chi tiết: </Typography></Grid>
                                    <Grid item xs={12}>
                                        <Paper elevation={4}>
                                            <Table className='source-display-table'>
                                                <TableBody>
                                                    {Object.entries(this.state.promotionInfo).map((item, index) => (
                                                        <TableRow key={item[0] + item[1]}>
                                                            <TableCell className='overflow-text'>
                                                                {item[0]}
                                                            </TableCell>
                                                            <TableCell className='overflow-text'>{item[1]}</TableCell>
                                                            <TableCell className='overflow-text'><Tooltip
                                                                title={resource.delete_key}>
                                                                <IconButton
                                                                    onClick={() => this.handleDeletePromotionInfo(item[0])}>
                                                                    <RemoveCircleOutlineIcon/>
                                                                </IconButton>
                                                            </Tooltip></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {
                                                        Object.entries(this.state.promotionInfo).length < 1 &&
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
                                                    name='promotion_key'
                                                    onChange={this.handleChange}
                                                    required
                                                    fullWidth
                                                    variant='outlined'
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <TextField
                                                    label={resource.meta_value}
                                                    name='promotion_value'
                                                    onChange={this.handleChange}
                                                    required
                                                    fullWidth
                                                    variant='outlined'
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{width: 78}}>
                                        <Tooltip title={resource.add1}>
                                            <Button variant='outlined' className='text-btn'
                                                    onClick={() => this.handleAddPromotionInfo()} size='small'
                                                    color='primary'>{resource.add1}</Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
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

    handleAddPromotionInfo = () => {
        if (!this.state.promotion_key || !this.state.promotion_value) {
            return;
        }
        const promotionInfo = {...this.state.promotionInfo};
        Object.assign(promotionInfo, {[this.state.promotion_key]: this.state.promotion_value});
        this.setState({promotionInfo});
    }
    handleDeletePromotionInfo = (keyDelete) => {
        const promotionInfo = {...this.state.promotionInfo};
        if (promotionInfo[keyDelete]) {
            delete promotionInfo[keyDelete];
        }
        this.setState({promotionInfo});
    }
}
