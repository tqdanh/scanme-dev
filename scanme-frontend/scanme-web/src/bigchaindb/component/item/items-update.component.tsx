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
import SaveIcon from '@material-ui/icons/Save';
import applicationContext from '../../config/ApplicationContext';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';

export class UpdateItemsForm extends React.Component<any, any> {
    productCatId = this.props.props.match.params.id;
    editItems: any[];
    private readonly itemService = applicationContext.getItemService();

    constructor(props) {
        super(props);
        this.editItems = this.props.history.location.state.data;
        this.state = {
            point: 10,
            mfg: new Date(),
            exp: moment(new Date()).add(3, 'months').toDate(),
            resultDialogOpen: false,
            isEditItemsSuccess: false,
            confirmDialogOpen: false
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
                <Typography component='h4' variant='h4' style={{width: 'fit-content'}}>{'Chỉnh sửa các mặt hàng'}<Button
                    onClick={() => this.props.history.goBack()} className='text-btn'
                    style={{textTransform: 'inherit'}}
                    color='secondary'><ArrowBackIcon/>  &nbsp; Quay
                    lại</Button>
                </Typography>
            </header>
            <main>
                <Grid container spacing={2}>
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
                        <Button variant='contained' color='primary'
                                onClick={() => this.onUpdateItems()}><SaveIcon/> &nbsp;{resource.update_product_items}
                        </Button>
                    </Grid>
                </Grid>
            </main>
            <Dialog
                open={this.state.resultDialogOpen}
                onClose={() => this.handleCloseResultDialog(this.state.isEditItemsSuccess)}
                aria-labelledby='info-dialog-title'
                aria-describedby='info-dialog-description'
            >
                <DialogTitle style={{textAlign: 'center'}}
                             id='alert-dialog-title'>{this.state.isEditItemsSuccess ?
                    <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> :
                    <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                <DialogContent>
                    {this.state.isEditItemsSuccess && (
                        <DialogContentText id='info-dialog-description'>
                            {resource.update_items_success}
                        </DialogContentText>
                    )}
                    {!this.state.isEditItemsSuccess && (
                        <DialogContentText id='info-dialog-description'>
                            {resource.update_items_fail}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleCloseResultDialog(this.state.isEditItemsSuccess)}
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
            point: 10,
            mfg: new Date(),
            exp: moment(new Date()).add(3, 'months').toDate(),
            resultDialogOpen: false,
            isEditItemsSuccess: false,
        });
    }

    private onUpdateItems() {
        const arrayItems: any[] = [];
        const {mfg, exp, point} = this.state;
        for (const item of this.editItems) {
            arrayItems.push({
                itemId: item[0],
                mfg: mfg ? moment(mfg).format('YYYY-MM-DD') : '',
                exp: exp ? moment(exp).format('YYYY-MM-DD') : '',
                lot: item[4],
                productCatId: this.productCatId,
                point,
                transactionId: '',
                actionCode: 0
            });
        }
        this.itemService.updateItems(arrayItems).subscribe(res => {
            if (res !== 'error') {
                // this.clearFields();
                this.setState({resultDialogOpen: true, isEditItemsSuccess: true});
            } else {
                this.setState({resultDialogOpen: true, isEditItemsSuccess: false});
            }
        });

    }
}

