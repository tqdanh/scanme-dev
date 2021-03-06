import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {CircularProgress, Divider, Typography} from '@material-ui/core';
import applicationContext from '../config/ApplicationContext';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/CheckCircle';
import * as qs from 'query-string';
import { withRouter } from 'react-router-dom';
class TransactionSearch extends React.Component<any, any> {
    private readonly supplyChainService = applicationContext.getSupplyChainService();
    private queryParam: any;

    constructor(props) {
        super(props);
        this.queryParam = qs.parse(props.location.search);
        console.log('props', this.props);
        this.state = {
            searchResults: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.supplyChainService.search({transactionId: this.queryParam.txId}).subscribe(res => {
            if (res !== 'error') {
                this.setState({searchResults: res.results, loading: false}, () => {
                    if (this.state.searchResults.length === 1) {
                        const row = this.state.searchResults[0];
                        this.props.history.push(`/getHisAssetByTransId?currentTransId=${this.queryParam.txId}`);
                        this.props.history.push(`/append-info`, {
                                transaction: row,
                                divideTransactions: this.state.searchResults,
                                selectedOutputIndex: row.outputIndex
                            }
                        );
                    }
                });
            }
        });
    }

    handleNavigateToAppendDataForm = (row) => {
        this.props.history.push(`/getHisAssetByTransId?currentTransId=${this.queryParam.txId}`);
        this.props.history.push({
            pathname: `/append-info`,
            state: {
                transaction: row,
                divideTransactions: this.state.searchResults,
                selectedOutputIndex: row.outputIndex
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <span style={{display: 'flex', alignItems: 'center'}}><CircularProgress size={24} style={{margin: 8}}/>??ang t???i d??? li???u...</span>;
        }
        if (!this.state.loading && this.state.searchResults.length <= 0) {
            return <h1>Giao d???ch n??y kh??ng th??? x??? l?? ti???p ???????c!</h1>;
        }
        return <div>
            <header style={{paddingLeft: 16}}>
                <Typography variant='h5' component='h5'>{`Danh s??ch c??c Transactions`}
                    <br/>
                    <Typography style={{fontSize: 13}}>Vui l??ng ch???n 1 giao d???ch ????? th??m th??ng tin</Typography>
                </Typography>
            </header>
            <Divider style={{marginTop: 16}}/>
            <Paper style={{width: '100%', overflowX: 'auto'}}>
                {this.state.searchResults.map((row, index) => <><List key={index}
                >
                    <ListItem button onClick={() => this.handleNavigateToAppendDataForm(row)}>
                        <ListItemIcon>
                            <CheckIcon style={{color: '#07ff00'}}/>
                        </ListItemIcon>
                        <ListItemText primary={`M?? giao d???ch: ${row.transactionId}`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon style={{color: '#07ff00'}}/>
                        </ListItemIcon>
                        <ListItemText primary={`S??? l?????ng: ${row.amount}`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon style={{color: '#07ff00'}}/>
                        </ListItemIcon>
                        <ListItemText primary={`Ch??? s??? s??? d???ng cho giao d???ch k??? ti???p: ${row.outputIndex}`}/>
                    </ListItem>
                </List> <Divider/></>)}
            </Paper>
        </div>;
    }
}

export default withRouter(TransactionSearch);
