import * as React from 'react';
import applicationContext from '../config/ApplicationContext';
import { Field, Form } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  Paper,
  Select as MatSelect, Table, TableBody, TableCell, TableHead, TableRow,
  TextField as TextFieldMat,
  Tooltip,
  Typography
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import * as uuidv4 from 'uuid/v4';
import {ResourceManager, StringUtil} from 'src/core';
import { storage } from '../../common/storage';
import IntegrationDownshift from './down-shift';
import * as moment from 'moment';
moment.locale('vi');
import '../big-chain.scss';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import InfoIcon from '@material-ui/icons/Info';
import {autocompleteMetaKeyData, convertMetaKeyData} from './common/autocomplete';
export class TransferForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      metaInfo: {},
      selectedProductName: '',
      products: [],
      confirmDialogOpen: false,
      confirm: false,
      resultDialogOpen: false,
      autocompleteOrgNames: [],
      selectedOrg: [],
      isAddAssetSuccessful: false,
      selectedMetaKey: ''
    };
  }
  private readonly supplyChainService = applicationContext.getSupplyChainService();
  private readonly organizationService = applicationContext.getOrganizationService();

  componentDidMount() {
    const orgId = storage.getProviderIdOfUser();
    this.organizationService.getProductByOrgId(orgId).subscribe(data => {
      this.setState({products: data});
    });
    this.organizationService.getAllOrganization().subscribe((data: any) => {
      this.setState({autocompleteOrgNames: data.results});
    });
  }
  validate = values => {
    const errors: any = {};
    const resource = ResourceManager.getResource();
    if (!values.metaNoteAction) {
      errors.metaNoteAction = resource.required_error;
    }
    // if (!values.ORGAutoCompleteValue) {
    //   errors.ORGAutoCompleteValue = resource.required_error;
    // }
    if (Object.entries(this.state.metaInfo).length < 1) {
      // errors.metaKey = 'Please add at lease one info';
      // errors.metaValue = 'Please add at lease one info';

      if (!this.state.selectedMetaKey && values.metaValue) {
        errors.metaKey = 'Please add at lease one info';
      }
      if (this.state.selectedMetaKey && !values.metaValue) {
        errors.metaValue = 'Please add at lease one info';
      }
      if (!this.state.selectedMetaKey && !values.metaValue) {
        errors.metaKey = 'Please add at lease one info';
        errors.metaValue = 'Please add at lease one info';
      }
    }
    return {...errors};
  }
  confirmSubmit = () => {
    this.setState({ confirmDialogOpen: true, confirm: false });
  }
  handleAddMetaInfo = (values) => {
    if (!this.state.selectedMetaKey || !values.metaValue) {
      return;
    }
    const metaInfo = { ...this.state.metaInfo };
    Object.assign(metaInfo, { [this.state.selectedMetaKey]: values.metaValue });
    this.setState({ metaInfo });
  }
  handleDeleteAdditionalMetaInfo = (values, keyDelete) => {
    const metaInfo = { ...this.state.metaInfo };
    if (metaInfo[keyDelete]) {
      delete metaInfo[keyDelete];
    }
    this.setState({ metaInfo });
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
  handleCloseResultDialog = (isTransferSuccess) => {
    this.setState({ resultDialogOpen: false }, () => {
      this.props.closeModal(2);
      if (isTransferSuccess) {
        this.props.onSuccess();
      }
    });
  }
  onSubmit = values => {
    const {transaction, selectedOutputIndex} = this.props;
    const { metaInfo, selectedProductName, selectedOrg } = this.state;
    const { metaNoteAction } = values;
    const transferOrganization = selectedOrg[0];
    const requestModel: any = {
      contents: {
        ...metaInfo
      },
      noteAction: metaNoteAction
    };
    this.supplyChainService.transferAsset(transaction.transactionId, selectedOutputIndex, transferOrganization._id, requestModel).subscribe(res => {
      if (res === 'error') {
         this.setState({ resultDialogOpen: true });
      } else {
        this.setState({ resultDialogOpen: true, isAddAssetSuccessful: true });
      }
    });
  }
  convertData = (array: any[]) => {
    const labelArray = [];
    array.forEach(item => {
      labelArray.push(
        { ...item, label: item.organizationName }
      );
    });
    return labelArray;
  }
  handleItemSelected = (event) => {
    this.setState({ selectedOrg: event });
  }
  onChangeSearchInput = (event) => {
    this.organizationService.getOrganizationByName({name: event.target.value}).subscribe((data: any) => {
      this.setState({autocompleteOrgNames: data.results});
    });
  }

  formatNumber = (number: number) => {
    return number.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
    );
  }
  handleMetaKeySelected = (event) => {
    this.setState({selectedMetaKey: event[0]});
  }
  onChangeMetaKeyInput = (event) => {
    const value = event.target.value.trim();
    this.setState({selectedMetaKey: value});
  }
  render() {
    const { transaction } = this.props;
    const { autocompleteOrgNames } = this.state;
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
            <Grid item style={{ margin: 'auto' }}>
              <Tooltip title='More Asset Information' placement='right'>
                <Typography style={{color: '#fff'}} variant='h4' align='left' component='h4'>
                  {resource.transfer_asset_form}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip style={{ color: 'inherit' }} title='Close'>
                <IconButton onClick={() => this.props.closeModal(2)}>
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
              createDate: moment(transaction.assetData.timeStamp).locale('vi').format('MM/DD/YYYY, h:mm:ss a'),
              amount: transaction.amount
            }}
            validate={this.validate}
            render={({ handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit} noValidate autoComplete={'off'}>
                <Paper style={{ padding: 16, boxShadow: 'none' }}>
                  <Grid container alignItems='flex-start' spacing={2}>
                    <Grid item xs={12} className='section-border'>
                      <Field
                        required
                        fullWidth
                        items={autocompleteOrgNames}
                        name='ORGAutoCompleteValue'
                        component={IntegrationDownshift}
                        label={resource.transfer_name}
                        placeholder={resource.transfer_name_holder}
                        onItemSelected={this.handleItemSelected}
                        convertData={this.convertData}
                        objectModel='organization'
                        multipleSelect={false}
                        onChangeInput={this.onChangeSearchInput}
                      />
                    </Grid>
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
                            style={{ width: 'fit-content' }}
                          >
                            {resource.asset_info}
                          </Typography>
                        </Tooltip>
                        <FormGroup row style={{marginTop: 8}}>
                          <Grid container alignItems='flex-start' spacing={2}>
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
                                  name='amount'
                                  fullWidth
                                  component={TextField}
                                  type='number'
                                  label={resource.amount1}
                                  InputProps={{
                                    readOnly: true
                                  }}
                              />
                            </Grid>
                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} className='section-border'>
                      <FormControl
                        component='fieldset'
                        style={{ width: '100%' }}
                      >
                        <Tooltip
                          className='primary-color'
                          title='Detail Information'
                          placement='right'
                        >
                          <Typography
                            variant='h5'
                            component='h5'
                            style={{ width: 'fit-content' }}
                          >
                            {resource.additional_meta_info}
                          </Typography>
                        </Tooltip>
                        <FormGroup row>
                          <Grid container alignItems='flex-start' spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                name='metaNoteAction'
                                fullWidth
                                required
                                component={TextField}
                                type='text'
                                label={resource.meta_note_action}
                                multiline
                                rows='3'
                                variant='outlined'
                                margin='normal'
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <p>{`${resource.content} ${resource.meta_info_note}`}</p>
                              <Grid
                                container
                                alignItems='flex-start'
                                spacing={2}
                              >
                                <Grid item xs={12}>
                                  <Grid
                                    container
                                    justify='center'
                                    alignItems='flex-end'
                                    spacing={2}
                                  >
                                    <Grid item style={{width: '100%'}}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                          <Field
                                              required
                                              fullWidth
                                              items={autocompleteMetaKeyData}
                                              name='metaKey'
                                              component={IntegrationDownshift}
                                              label={resource.meta_key}
                                              onItemSelected={this.handleMetaKeySelected}
                                              convertData={convertMetaKeyData}
                                              objectModel='metaKey'
                                              multipleSelect={false}
                                              onChangeInput={this.onChangeMetaKeyInput}
                                          />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                          <Field
                                              style={{marginTop: 16}}
                                              name='metaValue'
                                              required
                                              fullWidth
                                              component={TextField}
                                              type='text'
                                              label={resource.meta_value}
                                              InputLabelProps={{ shrink: true }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item style={{ width: 78 }}>
                                      <Tooltip title={resource.add1}>
                                        <Button variant='outlined' className='text-btn' onClick={() =>
                                            this.handleAddMetaInfo(values)} size='small' color='primary'>{resource.add1}</Button>
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                  <Grid
                                    container
                                    alignItems='flex-start'
                                    spacing={2}
                                  >
                                    <Grid item xs={12}>
                                      <Table className='source-display-table'>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell style={{ width: 'calc(85%/2)' }} className='overflow-text'>{resource.meta_key1}</TableCell>
                                            <TableCell style={{ width: 'calc(85%/2)' }} className='overflow-text'>{resource.meta_value1}</TableCell>
                                            <TableCell style={{ width: '50px' }} className='overflow-text'/>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {Object.entries(this.state.metaInfo).map((entry, index) => (
                                              <TableRow key={entry[0] + entry[1]}>
                                                <TableCell className='overflow-text'>
                                                  {entry[0]}
                                                </TableCell>
                                                <TableCell className='overflow-text'>{entry[1]}</TableCell>
                                                <TableCell className='overflow-text'><Tooltip
                                                    title={resource.delete_key}>
                                                  <IconButton
                                                      onClick={() => this.handleDeleteAdditionalMetaInfo(values, entry[0])}>
                                                    <RemoveCircleOutlineIcon />
                                                  </IconButton>
                                                </Tooltip></TableCell>
                                              </TableRow>
                                          ))}
                                          {
                                            Object.entries(this.state.metaInfo).length < 1 &&
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
                              </Grid>
                            </Grid>
                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <Grid
                        container
                        alignItems='center'
                        justify='center'
                        spacing={2}
                      >
                        <Grid item>
                          <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={submitting}
                          >
                            {resource.transfer}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            onClick={() => this.props.closeModal(2)}
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
                          {resource.transfer_data_confirm}
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
                      onClose={() => this.handleCloseResultDialog(this.state.isAddAssetSuccessful)}
                      aria-labelledby='info-dialog-title'
                      aria-describedby='info-dialog-description'
                    >
                      <DialogTitle style={{textAlign: 'center'}} id='alert-dialog-title'>{this.state.isAddAssetSuccessful ? <DoneIcon style={{fontSize: 64}} className='dialog-icon-success'/> : <ClearOutlineIcon style={{fontSize: 64}} className='dialog-icon-fail'/>}</DialogTitle>
                      <DialogContent>
                        {this.state.isAddAssetSuccessful && (
                          <DialogContentText id='info-dialog-description'>
                            {resource.transfer_success}
                          </DialogContentText>
                        )}
                        {!this.state.isAddAssetSuccessful && (
                          <DialogContentText id='info-dialog-description'>
                            {resource.error_transfer}
                          </DialogContentText>
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => this.handleCloseResultDialog(this.state.isAddAssetSuccessful)}
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
