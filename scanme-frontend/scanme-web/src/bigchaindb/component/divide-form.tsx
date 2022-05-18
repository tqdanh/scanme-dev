import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import applicationContext from '../config/ApplicationContext';
import { Field, Form } from 'react-final-form';
import {TextField } from 'final-form-material-ui';
import {
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../big-chain.scss';
import {storage} from '../../common/storage';
import {ResourceManager} from '../../common/ResourceManager';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import InfoIcon from '@material-ui/icons/Info';
interface DivideInfo {
  divideProductLine: string;
  divideDescription: string;
  divideAmount: number;
}
export class DivideModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      confirmDialogOpen: false,
      confirm: false,
      resultDialogOpen: false,
      divideAssetInfo: {
        numberOfDivideAssets: 0,
        divideInfo: []
      },
      isDivideAssetSuccessful: false
    };
  }
  private readonly supplyChainService = applicationContext.getSupplyChainService();

  // new ui
  validate = () => {
    const errors: any = {};
    return {...errors};
  }
  confirmSubmit = () => {
    this.setState({ confirmDialogOpen: true, confirm: false });
  }
  handleClose = () => {
    this.setState({ confirmDialogOpen: false });
  }
  handleConfirm = (values) => {
    this.setState({ confirmDialogOpen: false, confirm: true }, () => {
      this.onSubmit(values);
      // this.setState({ confirmDialogOpen: false });
      // this.setState({ resultDialogOpen: true });
    });
  }
  handleCloseResultDialog = (isDivideSuccess) => {
    this.setState({ resultDialogOpen: false }, () => {
      this.props.closeModal(3);
      if (isDivideSuccess) {
        this.props.onSuccess();
      }
    });
  }
  onSubmit = values => {
    const { transaction, selectedOutputIndex } = this.props;
    const { divideAssetInfo } = this.state;
    const { divideInfo } = divideAssetInfo;

    const bodyRequest = divideInfo.length > 0 ? {
      divideContent: divideInfo.map((info: DivideInfo) => ({
        amount: values[info.divideAmount],
        'Dòng sản phẩm': values[info.divideProductLine],
        'Mô tả': values[info.divideDescription]
      }))
    } : {};

    this.supplyChainService.divideAsset(transaction.transactionId, selectedOutputIndex, bodyRequest).subscribe(res => {
      if (res === 'error') {
        this.setState({ resultDialogOpen: true });
     } else {
       this.setState({ resultDialogOpen: true, isDivideAssetSuccessful: true });
     }
    });
  }

  addDivide = () => {
    const { divideAssetInfo } = this.state;
    const { numberOfDivideAssets, divideInfo } = divideAssetInfo;
    const increaseNumberOfDivideAssets = numberOfDivideAssets + 1;
    const namePrefix = `${increaseNumberOfDivideAssets}-divide-`;
    const clone_arr = [...divideInfo];
    clone_arr.push({
      divideProductLine: `${namePrefix}divideProductLine`,
      divideDescription: `${namePrefix}divideDescription`,
      divideAmount: `${namePrefix}divideAmount`,
    });

    const divideAssetInfoNewState = {
      numberOfDivideAssets: increaseNumberOfDivideAssets,
      divideInfo: clone_arr
    };

    this.setState({ divideAssetInfo: divideAssetInfoNewState});
  }

  removeDivide = (index) => {
    const { divideAssetInfo } = this.state;
    const { numberOfDivideAssets, divideInfo } = divideAssetInfo;

    const clone_arr = [...divideInfo];
    if (clone_arr.length <= 0) { return; }

    clone_arr.splice(index, 1);
    const decreaseNumberOfDivideAssets = numberOfDivideAssets - 1;

    const divideAssetInfoNewState = {
      numberOfDivideAssets: decreaseNumberOfDivideAssets,
      divideInfo: clone_arr
    };

    this.setState({ divideAssetInfo: divideAssetInfoNewState});
  }

  render() {
    const { transaction } = this.props;
    const resource = ResourceManager.getResource();
    return (
      <>
        <CssBaseline />
        <header
          style={{
            width: '100%',
            height: 50,
            background: '#2979ff',
            color: '#fff',
            paddingLeft: 16
          }}
        >
          <Grid container justify={'space-between'}>
            <Grid item style={{ margin: 'auto'}}>
              <Tooltip title='More Asset Information' placement='right'>
                <Typography style={{color: '#fff'}} variant='h4' align='left' component='h4'>
                  {resource.divide_asset_form}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip style={{ color: 'inherit' }} title='Close'>
                <IconButton onClick={() => this.props.closeModal(3)}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </header>
        <div className='addAssetModal'>
          <Form
            onSubmit={this.confirmSubmit}
            initialValues={{
              providerId: storage.getProviderIdOfUser(),
              providerName: transaction.metaData && transaction.metaData.providerName || '-',
              productLine: transaction.assetData.contents.productLine,
              productDescription: transaction.assetData.contents.productDescription,
              createDate: transaction.assetData.timeStamp,
              totalAmount: transaction.amount
            }}
            validate={this.validate}
            render={({ handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit} noValidate autoComplete={'off'}>
                <Paper style={{ padding: 16, boxShadow: 'none' }}>
                  <Grid container alignItems='flex-start' spacing={4}>
                    <Grid item xs={12} className='section-border'>
                      <FormControl component='fieldset'>
                        <Tooltip
                          className='primary-color'
                          title='Basic Information'
                          placement='right'
                        >
                          <Typography
                            variant='h5'
                            component='h5'
                            style={{ width: 'fit-content', marginBottom: 8 }}
                          >
                            {resource.asset_info}
                          </Typography>
                        </Tooltip>
                        <FormGroup row>
                          <Grid container alignItems='flex-start' spacing={4}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                fullWidth
                                name='providerId'
                                component={TextField}
                                type='text'
                                label={resource.provider_id}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                fullWidth
                                name='providerName'
                                component={TextField}
                                type='text'
                                label={resource.provider_name}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                name='productLine'
                                fullWidth
                                component={TextField}
                                type='text'
                                label={resource.product_line}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                name='productDescription'
                                fullWidth
                                component={TextField}
                                type='text'
                                label={resource.product_description}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                name='createDate'
                                fullWidth
                                component={TextField}
                                type='text'
                                label={resource.created_date2}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                name='totalAmount'
                                fullWidth
                                component={TextField}
                                type='number'
                                label={resource.amount1}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className='section-border'>
                      <FormControl component='fieldset'>
                        <Tooltip
                          className='primary-color'
                          title='Divide'
                          placement='right'
                        >
                          <Typography
                            variant='h5'
                            component='h5'
                            style={{ width: 'fit-content', marginBottom: 8 }}
                          >
                            {resource.divide_info}
                          </Typography>
                        </Tooltip>
                        <FormGroup row style={{marginTop: 24}}>
                          { this.state.divideAssetInfo.divideInfo.map((info: DivideInfo, index) => <Grid key={index} container justify='center' alignItems='flex-start' spacing={4}>
                            <Grid alignItems='center' justify='center' container spacing={4} style={{width: '100%'}}>
                              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Field
                                  required
                                  name={`${info.divideProductLine}`}
                                  fullWidth
                                  component={TextField}
                                  type='text'
                                  label={`${resource.asset_line} (${index})`}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Field
                                  required
                                  name={`${info.divideDescription}`}
                                  fullWidth
                                  component={TextField}
                                  type='text'
                                  label={`${resource.asset_description} (${index})`}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Field
                                  required
                                  name={`${info.divideAmount}`}
                                  fullWidth
                                  component={TextField}
                                  type='number'
                                  label={`${resource.divide_amount} (${index})`}
                                  min='0'
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item style={{width: 50}}>
                            <Tooltip onClick={() => this.removeDivide(index)} style={{ color: 'inherit' }} title={resource.delete_divide}>
                                <IconButton>
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>)}
                          <Grid container justify='center' alignItems='center'>
                            <Tooltip title={resource.add_divide} style={{ color: 'inherit' }}>
                              <Button variant='outlined' className='text-btn' onClick={this.addDivide} size='small' color='primary'>{resource.add_divide}</Button>
                            </Tooltip>
                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <Grid
                        container
                        alignItems='center'
                        justify='center'
                        spacing={4}
                      >
                        <Grid item>
                          <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                          >
                            {resource.divide}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            onClick={() => this.props.closeModal(3)}
                            color='secondary'
                            className='text-btn'
                          >
                            {resource.cancel1}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Dialog
                      open={this.state.confirmDialogOpen}
                      onClose={this.handleClose}
                      aria-labelledby='alert-dialog-title'
                      aria-describedby='alert-dialog-description'
                    >
                      <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'><InfoIcon style={{fontSize: 64}} className='dialog-icon-confirm'/></DialogTitle>
                      <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                          {resource.divide_data_confirm}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                          {resource.cancel1}
                        </Button>
                        <Button
                          onClick={() => this.handleConfirm(values)}
                          color='primary'
                          autoFocus
                        >
                          {resource.ok}
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Dialog
                      open={this.state.resultDialogOpen}
                      onClose={() => this.handleCloseResultDialog(this.state.isDivideAssetSuccessful)}
                      aria-labelledby='info-dialog-title'
                      aria-describedby='info-dialog-description'
                    >
                      <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'>{this.state.isDivideAssetSuccessful ? <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> : <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                      <DialogContent>
                        {this.state.isDivideAssetSuccessful && (
                          <DialogContentText id='info-dialog-description'>
                            {resource.divide_success}
                          </DialogContentText>
                        )}
                        {!this.state.isDivideAssetSuccessful && (
                          <DialogContentText id='info-dialog-description'>
                            {resource.error_divide}
                          </DialogContentText>
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => this.handleCloseResultDialog(this.state.isDivideAssetSuccessful)}
                          color='primary'
                          autoFocus
                        >
                          {resource.ok}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Paper>
              </form>
            )}
          />
        </div>
      </>
    );
  }
}
