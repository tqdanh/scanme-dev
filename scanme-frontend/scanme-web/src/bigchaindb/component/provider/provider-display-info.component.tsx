import * as React from 'react';
import {
    Backdrop,
    Box,
    Button, Card, CardActions,
    CardContent,
    CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, Fade,
    FormControl,
    Grid,
    InputLabel, Paper,
    Select as MatSelect, Tab, Table, TableBody, TableCell, TableHead,
    TableRow, Tabs,
    Tooltip,
    Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import './provider-info.scss';
import applicationContext from '../../config/ApplicationContext';
import {storage} from '../../../common/storage';
import config from '../../../config';
import {Modal} from '@material-ui/core/';
import {ProviderEditBasicInfoModal} from './provider-edit-basicInfo-modal';
import {ProviderEditPromotionInfoModal} from './provider-edit-promotion-modal';
import {ProviderEditAdInfoModal} from './provider-edit-ad-modal';
import {Map as LeafletMap, Marker, Popup, TileLayer} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './provider-display-info.component.scss';
import AddIcon from '@material-ui/icons/Add';
import {ResourceManager} from '../../../common/ResourceManager';
import InfoIcon from '@material-ui/icons/Info';
import {GiftDisplayComponent} from './gift-display.component';
import {CustomerDisplayComponent} from './customer-display.component';
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

export class ProviderInfoForm extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            providerData: {},
            isOpenEditBasicInfoModal: false,
            isOpenEditPromotionModal: false,
            isOpenEditAdModal: false,
            promotion: {},
            indexPromotion: 0,
            ad: {},
            indexAd: 0,
            isAddNewPromotion: false,
            isAddNewAd: false,
            confirmDeletePromotionDialogOpen: false,
            confirmDeleteAdDialogOpen: false,
        };
    }
    private providerService = applicationContext.getProviderService();
    private providerId = storage.getProviderIdOfUser();
    private callBack: any;

    a11yProps = (index: any) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    handleChange = (event, value) => {
        this.setState({value});
    }

    componentDidMount(): void {
        const defaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });
        L.Marker.prototype.options.icon = defaultIcon;
        this.providerService.getProviderInfo(this.providerId).subscribe(res => {
            if (res !== 'error') {
                this.setState({providerData: res});
            } else {

            }
        });
    }

    openEditBasicInfoModal = () => {
        this.setState({isOpenEditBasicInfoModal: true});
    }

    openEditPromotionInfoInfoModal = (promotion, index) => {
        this.setState({isOpenEditPromotionModal: true, indexPromotion: index, promotion});
    }

    openEditAdInfoModal = (ad, index) => {
        this.setState({isOpenEditAdModal: true, indexAd: index, ad});
    }

    handleCloseBasicInfoModal = () => {
        this.setState({isOpenEditBasicInfoModal: false}, () => {
            this.componentDidMount();
        });
    }

    handleClosePromotionInfoModal = () => {
        this.setState({isOpenEditPromotionModal: false}, () => {
            this.componentDidMount();
        });
    }


    handleCloseAdInfoModal = () => {
        this.setState({isOpenEditAdModal: false}, () => {
            this.componentDidMount();
        });
    }


    getProviderTypeName = (type: string) => {
        if (type === 'farmer') {
            return 'Nông trường';
        } else if (type === 'producer') {
            return 'Nhà Sản xuất';
        } else if (type === 'distributor') {
            return 'Nhà Phân phối';
        } else if (type === 'retailer') {
            return 'Nhà Bán lẻ';
        }
    }
    addAdInfo = () => {
        const countIndexAd = this.state.providerData && this.state.providerData.adsDescriptions ? this.state.providerData.adsDescriptions.length : 0;
        this.setState({isOpenEditAdModal: true, indexAd: countIndexAd, ad: this.createEmptyPromotionAdInfo(), isAddNewAd: true});
    }
    createEmptyPromotionAdInfo = () => {
        return {
            'title': '',
            'description': '',
            'images': [
            ],
            'attributes': [
            ],
            'notes': [
            ]
        };
    }
    addPromotionInfo = () => {
        const countIndexPromotion = this.state.providerData && this.state.providerData.promotionDescriptions ? this.state.providerData.promotionDescriptions.length : 0;
        this.setState({isOpenEditPromotionModal: true, indexPromotion: countIndexPromotion, promotion: this.createEmptyPromotionAdInfo(), isAddNewPromotion: true});
    }
    confirmRemovePromotionInfo = () => {

    }
    onRemovePromotionInfo(prommotion, index) {
        const {providerData} = this.state;
        const {promotionDescriptions} = providerData;
        promotionDescriptions.splice(index, 1);
        providerData.promotionDescriptions = [...promotionDescriptions];
        providerData['organizationId'] = providerData['_id'];
        delete providerData['_id'];
        this.providerService.updateProviderInfo(this.providerId, providerData).subscribe(res => {
            if (res !== 'error') {
                this.providerService.getProviderInfo(this.providerId).subscribe(res1 => {
                    if (res !== 'error') {
                        this.setState({providerData: res1});
                    } else {

                    }
                });
            }
        });
    }
    onRemoveAdInfo(ad, index) {
        const {providerData} = this.state;
        const {adsDescriptions} = providerData;
        adsDescriptions.splice(index, 1);
        providerData.adsDescriptions = [...adsDescriptions];
        providerData['organizationId'] = providerData['_id'];
        delete providerData['_id'];
        this.providerService.updateProviderInfo(this.providerId, providerData).subscribe(res => {
            if (res !== 'error') {
                this.providerService.getProviderInfo(this.providerId).subscribe(res1 => {
                    if (res !== 'error') {
                        this.setState({providerData: res1});
                    } else {

                    }
                });
            }
        });
    }

    handleCloseConfirmDeletePromotion = () => {
        this.setState({
            confirmDeletePromotionDialogOpen: false,
        });
        this.callBack = null;
    }
    handleCloseConfirmDeleteAd = () => {
        this.setState({
            confirmDeleteAdDialogOpen: false,
        });
        this.callBack = null;
    }
    handleAcceptDeletePromotion = () => {
        this.setState({
            confirmDeletePromotionDialogOpen: false,
        }, this.callBack);
        this.callBack = null;
    }
    handleAcceptDeleteAd = () => {
        this.setState({
            confirmDeleteAdDialogOpen: false,
        }, this.callBack);
        this.callBack = null;
    }
    handleConfirmDeletePromotion = (cb) => {
        this.callBack = cb;
        this.setState({
            confirmDeletePromotionDialogOpen: true,
        });
    }
    handleConfirmDeleteAd = (cb) => {
        this.callBack = cb;
        this.setState({
            confirmDeleteAdDialogOpen: true,
        });
    }
    render() {
        const {value} = this.state;
        const resource = ResourceManager.getResource();
        return <div style={{flexGrow: 1}} className={'provider-info'}>
            <header className='provider-page-header'>
                <Typography component='h4' variant='h4'>Doanh nghiệp</Typography>
            </header>
            <Tabs
                style={{ marginBottom: 16, boxShadow: '#737373b5 1px 1px 3px 0px'}}
                className='provider-tabs'
                value={value}
                onChange={(event, value1) => this.handleChange(event, value1)}
                indicatorColor='primary'
                textColor='primary'
                aria-label='provider-info'
            >
                <Tab label='Thông tin doanh nghiệp'/>
                <Tab label='Thông tin khuyến mãi'/>
                <Tab label='Thông tin quảng cáo'/>
                <Tab label='Quà tặng'/>
                <Tab label='Khách hàng'/>
            </Tabs>
            <Typography
                component='div'
                role='tabpanel'
                hidden={value !== 0}
                id={`simple-tabpanel-${0}`}
                aria-labelledby={`simple-tab-${0}`}
            >
                <Box>
                    <Grid item xs={12}>
                        <Card elevation={4} className={'provider-info-table'}>
                            <CardHeader title={
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Typography style={{fontWeight: 'bold'}}>{`Thông tin doanh nghiệp`}</Typography>
                                    <Button onClick={this.openEditBasicInfoModal} style={{marginLeft: 16}} size='small'><EditIcon/> &nbsp; Chỉnh sửa thông tin</Button>
                                </div>
                            }
                            />
                            <Divider/>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Table className='provider-basic-info-table'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Mã doanh nghiệp</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData._id}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Tên doanh nghiệp</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData.organizationName}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Loại doanh nghiệp</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.getProviderTypeName(this.state.providerData.organizationType)}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Địa chỉ</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData.organizationAddress}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Số điện thoại</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData.organizationPhone}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Email</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData.email}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Mô tả</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography style={{
                                                            display: 'block',
                                                            height: 80,
                                                            overflow: 'auto'
                                                        }}>{this.state.providerData.description}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Chứng nhận</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{this.state.providerData.certificate}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>Hình đại diện</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {this.state.providerData.imageUrl && <img
                                                            src={`${config.imageURL}/${this.state.providerData.imageUrl}`}
                                                            alt={'provider-ad-image'} style={{width: 250, height: 200}}
                                                        />}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <div style={{width: '100%'}}>
                                            {this.state.providerData && this.state.providerData.location && this.state.providerData.location.length > 0 && <LeafletMap
                                                center={this.state.providerData.location}
                                                zoom={12}
                                                maxZoom={20}
                                                attributionControl={true}
                                                zoomControl={true}
                                                scrollWheelZoom={true}
                                                dragging={true}
                                                animate={true}
                                                easeLinearity={0.35}
                                            >
                                                <TileLayer
                                                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                                                    url='https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZG10aGFuaCIsImEiOiJjazFsdmh0MW4wOWI0M210Y25tM3Q1MGxjIn0.p0jgT4bCU319g6iFZWXldg'
                                                />
                                                <Marker position={this.state.providerData.location}>
                                                    <Popup>
                                                        <span>
                                                            {this.state.providerData.imageUrl && <img style={{borderRadius: 2, width: 150}}
                                                                  src={`${config.imageURL}/${this.state.providerData.imageUrl}`}
                                                                  alt='provider_image_marker'/>}
                                                                  <br/>
                                                            {`Đc: ${this.state.providerData.organizationAddress}`}
                                                        </span>
                                                    </Popup>
                                                </Marker>
                                            </LeafletMap>}
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
            </Typography>
            <Typography
                component='div'
                role='tabpanel'
                hidden={value !== 1}
                id={`simple-tabpanel-${1}`}
                aria-labelledby={`simple-tab-${1}`}
            >
                <Box>
                    <Button onClick={this.addPromotionInfo} style={{marginLeft: 16}} size='small'><AddIcon/> Thêm thông tin khuyến mãi</Button>
                    <Grid container spacing={2}>
                        {this.state.providerData.promotionDescriptions && this.state.providerData.promotionDescriptions.map((promotion, index) =>
                            <Grid key={index} item xs={6}>
                                <Card elevation={4} style={{marginTop: 8}}>
                                    <CardHeader title={
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography
                                                style={{fontWeight: 'bold'}}>{`Thông tin khuyễn mãi`}</Typography>
                                            <div className='btn-group'>
                                                <Button onClick={() => this.openEditPromotionInfoInfoModal(promotion, index)}
                                                        style={{marginLeft: 16}} size='small'><EditIcon/> &nbsp; Chỉnh sửa thông tin
                                                </Button>
                                                <Button onClick={() => this.handleConfirmDeletePromotion(() => {
                                                    this.onRemovePromotionInfo(promotion, index);
                                                })}
                                                        style={{marginLeft: 16}} size='small'><DeleteIcon/> &nbsp; Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    />
                                    <Divider/>
                                    <CardContent>
                                        <Typography component={'h6'} variant={'h6'}>{promotion.title || ''}</Typography>
                                        <Typography style={{marginTop: 8}}>{promotion.description || ''}</Typography>
                                        {promotion.images[0] && <img
                                            src={`${config.imageURL}/${promotion.images[0]}`}
                                            alt={'provider-promotion-image'} style={{width: 300, marginTop: 8, height: 250}}
                                        />}
                                        <Table className='provider-basic-info-table'>
                                            <TableBody>
                                                {promotion.attributes.map((item, index1) =>
                                                    <TableRow key={index1}>
                                                        <TableCell>
                                                            <Typography>{item.name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{item.value}</Typography>
                                                        </TableCell>
                                                    </TableRow>)}
                                            </TableBody>
                                        </Table>
                                        <Typography style={{marginTop: 8}}>Ghi chú: {promotion.notes[0]}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>)}
                    </Grid>
                </Box>
            </Typography>
            <Typography
                component='div'
                role='tabpanel'
                hidden={value !== 2}
                id={`simple-tabpanel-${2}`}
                aria-labelledby={`simple-tab-${2}`}
            >
                <Box>
                    <Button onClick={this.addAdInfo} style={{marginLeft: 16}} size='small'><AddIcon/> Thêm thông tin quảng cáo</Button>
                    <Grid container spacing={2}>
                        {this.state.providerData.adsDescriptions && this.state.providerData.adsDescriptions.map((ad, index) =>
                            <Grid key={index} item xs={6}>
                                <Card elevation={4} style={{marginTop: 8}}>
                                    <CardHeader title={
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography
                                                style={{fontWeight: 'bold'}}>{`Thông tin quảng cáo`}</Typography>
                                            <div className='btn-group'>
                                                <Button onClick={() => this.openEditAdInfoModal(ad, index)}
                                                        style={{marginLeft: 16}} size='small'><EditIcon/> &nbsp; Chỉnh sửa
                                                    thông tin
                                                </Button>
                                                <Button onClick={() => this.handleConfirmDeleteAd(() => {
                                                    this.onRemoveAdInfo(ad, index);
                                                })}
                                                        style={{marginLeft: 16}} size='small'><DeleteIcon/> &nbsp; Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    />
                                    <Divider/>
                                    <CardContent>
                                        <Typography component={'h6'}
                                                    variant={'h6'}>{ad.title || ''}</Typography>
                                        <Typography style={{marginTop: 8}}>{ad.description || ''}</Typography>
                                        {ad.images[0] && <img
                                            src={`${config.imageURL}/${ad.images[0]}`}
                                            alt={'provider-promotion-image'} style={{width: 300, marginTop: 8, height: 250}}
                                        />}
                                        <Divider style={{marginTop: 8}}/>
                                        <Table className='provider-ad-info-table'>
                                            <TableBody>
                                                {ad.attributes.map((item, index1) =>
                                                    <TableRow key={index1}>
                                                        <TableCell>
                                                            <Typography>{item.name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>
                                                                {item.value && <img
                                                                src={`${config.imageURL}/${item.value}`}
                                                                alt={'provider-ad-product-image'} style={{width: 200, height: 150}}/>}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>)}
                                            </TableBody>
                                        </Table>
                                        <Typography style={{marginTop: 8}}>Ghi chú: {ad.notes[0]}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>)}
                    </Grid>
                </Box>
            </Typography>
            <Typography
                component='div'
                role='tabpanel'
                hidden={value !== 3}
                id={`simple-tabpanel-${3}`}
                aria-labelledby={`simple-tab-${3}`}
            >
                <Box>
                    <Grid item xs={12}>
                        <GiftDisplayComponent {...this.props}/>
                    </Grid>
                </Box>
            </Typography>
            <Typography
                component='div'
                role='tabpanel'
                hidden={value !== 4}
                id={`simple-tabpanel-${4}`}
                aria-labelledby={`simple-tab-${4}`}
            >
                <Box>
                    <Grid item xs={12}>
                        <Card elevation={4} className={'provider-info-table'}>
                            <CardContent>
                                <Grid item xs={12}>
                                    <CustomerDisplayComponent/>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
            </Typography>
            {/* Basic info */}
            <Modal
                className='custom-modal-provider'
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                style={{...commonModalStyle.modal}}
                open={this.state.isOpenEditBasicInfoModal}
                onClose={() => this.setState({isOpenEditBasicInfoModal: false})}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.isOpenEditBasicInfoModal}>
                    <div style={{...commonModalStyle.paper}}>
                        <ProviderEditBasicInfoModal
                            onClose={this.handleCloseBasicInfoModal}
                            providerData={this.state.providerData}
                        />
                    </div>
                </Fade>
            </Modal>
            {/*    Promotion */}
            <Modal
                className='custom-modal-provider'
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                style={{...commonModalStyle.modal}}
                open={this.state.isOpenEditPromotionModal}
                onClose={() => this.setState({isOpenEditPromotionModal: false})}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.isOpenEditPromotionModal}>
                    <div style={{...commonModalStyle.paper}}>
                        <ProviderEditPromotionInfoModal
                            onClose={this.handleClosePromotionInfoModal}
                            providerData={this.state.providerData}
                            promotion={this.state.promotion}
                            index={this.state.indexPromotion}
                            isAddNewPromotion={this.state.isAddNewPromotion}
                        />
                    </div>
                </Fade>
            </Modal>
            {/*    Ad modal */}
            <Modal
                className='custom-modal-provider'
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                style={{...commonModalStyle.modal}}
                open={this.state.isOpenEditAdModal}
                onClose={() => this.setState({isOpenEditAdModal: false})}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.isOpenEditAdModal}>
                    <div style={{...commonModalStyle.paper}}>
                        <ProviderEditAdInfoModal
                            onClose={this.handleCloseAdInfoModal}
                            providerData={this.state.providerData}
                            ad={this.state.ad}
                            index={this.state.indexAd}
                            isAddNewAd={this.state.isAddNewAd}
                        />
                    </div>
                </Fade>
            </Modal>
            {/*    Confirm remove promotion*/}
            <Dialog
                open={this.state.confirmDeletePromotionDialogOpen}
                onClose={this.handleCloseConfirmDeletePromotion}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'><InfoIcon style={{fontSize: 64}}
                    className='dialog-icon-confirm'/></DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {`Bạn có muốn xóa thông tin khuyến mãi này?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseConfirmDeletePromotion} color='primary'>
                        {resource.cancel1}
                    </Button>
                    <Button
                        onClick={this.handleAcceptDeletePromotion}
                        color='primary'
                        autoFocus
                    >
                        {resource.ok}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*    Confirm remove ad */}
            <Dialog
                open={this.state.confirmDeleteAdDialogOpen}
                onClose={this.handleCloseConfirmDeleteAd}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'><InfoIcon style={{fontSize: 64}}
                    className='dialog-icon-confirm'/></DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {`Bạn có muốn xóa thông tin quảng cáo này?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseConfirmDeleteAd} color='primary'>
                        {resource.cancel1}
                    </Button>
                    <Button
                        onClick={this.handleAcceptDeleteAd}
                        color='primary'
                        autoFocus
                    >
                        {resource.ok}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}
