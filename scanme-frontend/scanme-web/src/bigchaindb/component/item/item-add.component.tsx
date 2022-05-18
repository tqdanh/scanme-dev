import * as React from 'react';
import {ResourceManager} from '../../../common/ResourceManager';
import {
    Button, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import applicationContext from '../../config/ApplicationContext';
import {StringUtil} from '../../../common/util/StringUtil';
import * as uuidv4 from 'uuid/v4';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
export class AddItemForm extends React.Component<any, any> {
    private readonly itemService = applicationContext.getItemService();
    productCatId = this.props.props.match.params.id;
    constructor(props) {
        super(props);
        this.state = {
            lot: moment(new Date()).format('YYYYMMDD-HHmm'),
            quantity: 5,
            point: 10,
            mfg: new Date(),
            exp: moment(new Date()).add(3, 'months').toDate(),
            resultDialogOpen: false,
            isAddItemsSuccess: false,
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
    handleCloseResultDialog = (isAddSuccess) => {
        this.setState({resultDialogOpen: false}, () => {
            // this.searchModelByPageIndexAndPageSize(); // reload page
        });
    }
    render() {
        const resource = ResourceManager.getResource();
        return <Paper style={{padding: 16}}>
            <header className='add-product-page-header'
                    style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                <Typography component='h4' variant='h4' style={{width: 'fit-content'}}>{'Thêm mặt hàng'}<Button
                    onClick={() => this.props.history.goBack()} className='text-btn'
                    color='secondary'><ArrowBackIcon/>  &nbsp; Quay
                    lại</Button>
                </Typography>
            </header>
            <main>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                required
                                name='lot'
                                label='Mã lô'
                                onChange={this.handleChange}
                                InputLabelProps={{shrink: true}}
                                value={this.state.lot}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                autoOk
                                disableToolbar
                                variant='inline'
                                format='MM/dd/yyyy'
                                label={resource.mfg_date}
                                value={this.state.mfg}
                                onChange={(newDate) => this.setState({
                                    mfg: newDate
                                })}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                InputLabelProps={{shrink: true}}
                                required
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
                                value={this.state.exp}
                                onChange={(newDate) => this.setState({
                                    exp: newDate
                                })}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                InputLabelProps={{shrink: true}}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                required
                                type='number'
                                name='quantity'
                                label='Số lượng'
                                onChange={this.handleChange}
                                InputLabelProps={{shrink: true}}
                                value={this.state.quantity}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                required
                                type='number'
                                name='point'
                                label='Điểm'
                                onChange={this.handleChange}
                                InputLabelProps={{shrink: true}}
                                value={this.state.point}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container justify={'center'} spacing={2} style={{marginTop: 16}}>
                    <Grid item>
                        <Button style={{margin: '0 auto'}} onClick={() => this.clearFields()}
                                className='text-btn'
                                color='primary'>{resource.reset_btn}</Button>
                        <Button
                                variant='contained' color='primary'
                                onClick={() => this.onAddItems()}><AddIcon/>{resource.add_product_items}
                        </Button>
                    </Grid>
                </Grid>
            </main>
            <Dialog
                open={this.state.resultDialogOpen}
                onClose={() => this.handleCloseResultDialog(this.state.isAddItemsSuccess)}
                aria-labelledby='info-dialog-title'
                aria-describedby='info-dialog-description'
            >
                <DialogTitle style={{textAlign: 'center'}}
                             id='alert-dialog-title'>{this.state.isAddItemsSuccess ?
                    <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                    <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                <DialogContent>
                    {this.state.isAddItemsSuccess && (
                        <DialogContentText id='info-dialog-description'>
                            {resource.add_items_success}
                        </DialogContentText>
                    )}
                    {!this.state.isAddItemsSuccess && (
                        <DialogContentText id='info-dialog-description'>
                            {resource.add_items_fail}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleCloseResultDialog(this.state.isAddItemsSuccess)}
                        color='primary'
                        autoFocus
                    >
                        {resource.ok}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>;
    }

    private clearFields() {
        this.setState({
            lot: moment(new Date()).format('YYYYMMDD-HHmm'),
            quantity: 5,
            point: 10,
            mfg: new Date(),
            exp: moment(new Date()).add(3, 'months').toDate(),
            resultDialogOpen: false,
            isAddItemsSuccess: false,
        });
    }

    private onAddItems() {
        const arrayItems: any[] = [];
        const {quantity, mfg, exp, lot, point} = this.state;
        if (!isNaN(quantity) && quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                arrayItems.push({
                    itemId: StringUtil.uuid(uuidv4),
                    mfg: mfg ? moment(mfg).format('YYYY-MM-DD') : '',
                    exp: exp ? moment(exp).format('YYYY-MM-DD') : '',
                    lot,
                    productCatId: this.productCatId,
                    point,
                    transactionId: '',
                    actionCode: 0
                });
            }
            this.itemService.insertItems(arrayItems).subscribe(res => {
                if (res !== 'error') {
                    this.clearFields();
                    this.setState({resultDialogOpen: true, isAddItemsSuccess: true});
                } else {
                    this.setState({resultDialogOpen: true, isAddItemsSuccess: false});
                }
            });
        }
    }
}

