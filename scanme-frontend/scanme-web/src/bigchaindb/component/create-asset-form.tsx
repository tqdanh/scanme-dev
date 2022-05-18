import { TextField } from 'final-form-material-ui';
import * as React from 'react';
import { CreateProduct } from '../model/CreateProduct';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Field, Form } from 'react-final-form';
import applicationContext from '../config/ApplicationContext';
import {
    Button,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    List,
    ListItem, Paper, Table, TableBody, TableCell, TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import IntegrationDownshift from './down-shift';
import '../big-chain.scss';
import ClearIcon from '@material-ui/icons/Clear';
import {ResourceManager} from '../../common/ResourceManager';
import DoneIcon from '@material-ui/icons/DoneOutline';
import ClearOutlineIcon from '@material-ui/icons/ClearOutlined';
import InfoIcon from '@material-ui/icons/Info';
import {autocompleteMetaKeyData, convertMetaKeyData} from './common/autocomplete';
export class AddNewModal extends React.Component<any, any> {
    private readonly supplyChainService = applicationContext.getSupplyChainService();
    constructor(props) {
        super(props);
        this.state = {
            autocompleteData: [],
            metaInfo: {},
            selectedContents: [],
            confirmDialogOpen: false,
            confirm: false,
            resultDialogOpen: false,
            isAddAssetSuccessful: true,
            selectedMetaKey: ''
        };
    }

    componentDidMount = () => {
        this.supplyChainService.getDataAutoSearch().subscribe(result => {
            this.setState({
                autocompleteData: result
            });
        });
    }

    convertData = (array: any[]) => {
        const labelArray = [];
        array.forEach(item => {
            labelArray.push(
                { ...item, label: item.assetData.contents.productLine }
            );
        });
        return labelArray;
    }
    handleMetaKeySelected = (event) => {
        this.setState({selectedMetaKey: event[0]});
    }
    onChangeMetaKeyInput = (event) => {
        const value = event.target.value.trim();
        this.setState({selectedMetaKey: value});
    }
    onSubmit = values => {
        const { productLine, productDescription, quantityNumber, unitsNumber, assetNoteAction, metaNoteAction } = values;
        const { selectedContents: sources, metaInfo } = this.state;
        const requestModel: CreateProduct = {
            contents: {
                productLine,
                productDescription,
                quantity: quantityNumber,
                unit: unitsNumber
            },
            noteAction: assetNoteAction,
            metaData: {
                contents: {
                    ...metaInfo
                },
                noteAction: metaNoteAction
            },
            sources: sources.map(sourceInfo => ({
                productLine: sourceInfo.assetData.contents.productLine,
                transactionId: sourceInfo.transactionId,
                outputIndex: '' + sourceInfo.outputIndex
            }))
        };
        if (sources.length === 0) {
            delete requestModel['sources'];
        }
        this.supplyChainService.createNewAsset(requestModel).subscribe((res: any) => {
            if (res !== 'error' && sources.length !== 0) {
                for (const source of sources) {
                    if (source.transactionId) {
                        this.supplyChainService.burnAsset(source.transactionId, source.outputIndex).subscribe((burnRes: any) => {
                            if (burnRes === 'error') {
                                this.setState({ resultDialogOpen: false, isAddAssetSuccessful: false });
                            }
                        });
                    }
                }
            } else {
                if (res === 'error') {
                    this.setState({ resultDialogOpen: true, isAddAssetSuccessful: false });
                }
            }
        });
    }
    handleClose = () => {
        this.setState({ confirmDialogOpen: false });
    }
    confirmSubmit = () => {
        this.setState({ confirmDialogOpen: true, confirm: false });
    }
    handleConfirm = (values) => {
        this.setState({ confirmDialogOpen: false, confirm: true }, () => {
            this.onSubmit(values);
            this.setState({ confirmDialogOpen: false });
            this.setState({ resultDialogOpen: true });
        });
    }

    validate = values => {
        const errors: any = {};
        const resource = ResourceManager.getResource();
        if (!values.productLine) {
            errors.productLine = resource.required_error;
        }
        if (!values.productDescription) {
            errors.productDescription = resource.required_error;
        }
        if (!values.quantityNumber) {
            errors.quantityNumber = resource.required_error;
        }
        if (!values.unitsNumber) {
            errors.unitsNumber = resource.required_error;
        }
        if (!values.assetNoteAction) {
            errors.assetNoteAction = resource.required_error;
        }
        if (!values.metaNoteAction) {
            errors.metaNoteAction = resource.required_error;
        }
        if (Object.entries(this.state.metaInfo).length < 1) {
            if (!this.state.selectedMetaKey && values.metaValue) {
                errors.metaKey = resource.required_error;
            }
            if (this.state.selectedMetaKey && !values.metaValue) {
                errors.metaValue = resource.required_error;
            }
            if (!this.state.selectedMetaKey && !values.metaValue) {
                errors.metaKey = resource.required_error;
                errors.metaValue = resource.required_error;
            }
        }
        return errors;
    }

    handleItemSelected = (event) => {
        this.setState({ selectedContents: event });
    }

    handleAddMetaInfo = (values) => {
        if (!this.state.selectedMetaKey || !values.metaValue) {
            return;
        }
        const metaInfo = { ...this.state.metaInfo };
        Object.assign(metaInfo, { [this.state.selectedMetaKey]: values.metaValue });
        this.setState({ metaInfo });
    }
    handleCloseResultDialog = (isCreateSuccess) => {
        this.setState({ resultDialogOpen: false }, () => {
            this.props.closeModal(4);
            if (isCreateSuccess) {
                this.props.onSuccess();
            }
        });
    }
    handleDeleteAdditionalMetaInfo = (values, keyDelete) => {
        const metaInfo = { ...this.state.metaInfo };
        if (metaInfo[keyDelete]) {
            delete metaInfo[keyDelete];
        }
        this.setState({ metaInfo });
    }
    createAssetForm = () => {
        const { autocompleteData } = this.state;
        const resource = ResourceManager.getResource();
        return (<>
            <CssBaseline />
            <header style={{ width: '100%', height: 50, background: '#2979ff', color: '#fff', paddingLeft: 16 }}>
                <Grid container justify={'space-between'}>
                    <Grid item style={{ margin: 'auto' }}>
                        <Typography style={{color: '#fff'}} variant='h4' align='left' component='h4'>
                            {resource.add_asset_form}
                            </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip style={{ color: 'inherit' }} title='Close'>
                            <IconButton onClick={() => this.props.closeModal(4)}>
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </header>
            <div className='addAssetModal'>
                <Form
                    onSubmit={this.confirmSubmit}
                    initialValues={{}}
                    validate={this.validate}
                    render={({ handleSubmit, submitting, values }) => (
                        <form onSubmit={handleSubmit} noValidate autoComplete={'off'}>
                            <Paper style={{ padding: 16, boxShadow: 'none' }}>
                                <Grid container alignItems='flex-start' spacing={4}>
                                    <Grid item xs={12} className='section-border'>
                                        <FormControl component='fieldset'>
                                            <Tooltip className='primary-color' title='Basic Information' placement='right'>
                                                <Typography variant='h5' component='h5'
                                                    style={{ width: 'fit-content' }}>{resource.basic_info_section}</Typography>
                                            </Tooltip>
                                            <FormGroup row>
                                                <Grid container alignItems='flex-start' spacing={4}>
                                                    <Grid item xs={12}>
                                                        <Field
                                                            name='assetNoteAction'
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type='text'
                                                            label={resource.asset_note_action}
                                                            multiline
                                                            rows='3'
                                                            variant='outlined'
                                                            margin='normal'
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field
                                                            fullWidth
                                                            required
                                                            name='productLine'
                                                            component={TextField}
                                                            type='text'
                                                            label={resource.product_line}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field
                                                            fullWidth
                                                            required
                                                            name='productDescription'
                                                            component={TextField}
                                                            type='text'
                                                            label={resource.product_description}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field
                                                            name='quantityNumber'
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type='number'
                                                            label={resource.quantity_number}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field
                                                            name='unitsNumber'
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type='number'
                                                            label={resource.units_number}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} className='section-border'>
                                        <FormControl component='fieldset' style={{ width: '100%' }}>
                                            <Tooltip className='primary-color' title='Detail Information' placement='right'>
                                                <Typography variant='h5' component='h5'
                                                    style={{ width: 'fit-content' }}>{resource.meta_info_section}</Typography>
                                            </Tooltip>
                                            <FormGroup row>
                                                <Grid container alignItems='flex-start' spacing={4}>
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
                                                        <Grid container alignItems='flex-start' spacing={4}>
                                                            <Grid item xs={12}>
                                                                <Grid container justify='center' alignItems='flex-end' spacing={4}>
                                                                    <Grid item style={{width: '100%'}}>
                                                                        <Grid container spacing={4}>
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
                                                                <Grid container alignItems='flex-start' spacing={4}>
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

                                    <Grid item xs={12} className='section-border'>
                                        <FormControl component='fieldset'>
                                            <Tooltip className='primary-color' title='Source Information' placement='right'>
                                                <Typography variant='h5' component='h5'
                                                            style={{ width: 'fit-content' }}>{resource.source_info_section}</Typography>
                                            </Tooltip>
                                            <FormGroup row>
                                                <Grid container alignItems='flex-start' spacing={4}>
                                                    <Grid item xs={12}>
                                                        <Field
                                                            fullWidth
                                                            items={autocompleteData}
                                                            name='prodLineAutoCompleteValue'
                                                            component={IntegrationDownshift}
                                                            label={resource.product_line}
                                                            placeholder={resource.enter_product_line}
                                                            onItemSelected={this.handleItemSelected}
                                                            convertData={this.convertData}
                                                            objectModel='ProductLine'
                                                            onChangeInput={this.onChangeSearchInput}
                                                            multipleSelect={true}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Table className='source-display-table'>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ width: 65 }}>{resource.product_line}</TableCell>
                                                                    <TableCell style={{ width: 20 }}
                                                                               align='right'>{resource.amount1}</TableCell>
                                                                    <TableCell className='overflow-text'
                                                                               style={{ width: 100 }}>{resource.transaction_id}</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {this.state.selectedContents.length > 0 && this.state.selectedContents.map((content, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell className='overflow-text'>
                                                                            {content.assetData.contents.productLine}
                                                                        </TableCell>
                                                                        <TableCell className='overflow-text'
                                                                                   align='right'>{content.amount}</TableCell>
                                                                        <TableCell
                                                                            className='overflow-text'>{content.transactionId}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                {
                                                                    this.state.selectedContents.length < 1 &&
                                                                    <TableRow>
                                                                        <TableCell align='center' colSpan={3}>
                                                                            {resource.no_select_data}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </Grid>
                                                </Grid>
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} style={{ marginTop: 16 }}>
                                        <Grid container alignItems='center' justify='center' spacing={4}>
                                            <Grid item>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    type='submit'
                                                    disabled={submitting}
                                                >
                                                    {resource.add_asset_btn}
                                                    </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={() => this.props.closeModal(4)} color='secondary'
                                                    className='text-btn'>
                                                    {resource.cancel_asset_btn}
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
                                                {resource.confirm_add_asset}
                                                </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClose} color='primary'>
                                                {resource.cancel1}
                                                </Button>
                                            <Button onClick={() => this.handleConfirm(values)} color='primary'
                                                autoFocus>
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
                                            {this.state.isAddAssetSuccessful &&
                                                <DialogContentText id='info-dialog-description'>
                                                    {resource.add_asset_success}
                                                </DialogContentText>}
                                            {!this.state.isAddAssetSuccessful &&
                                                <DialogContentText id='info-dialog-description'>
                                                    {resource.error_add_asset}
                                                </DialogContentText>}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => this.handleCloseResultDialog(this.state.isAddAssetSuccessful)} color='primary'
                                                autoFocus>
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
    onChangeSearchInput = () => {

    }
    render() {
        return (this.createAssetForm());
    }
}
