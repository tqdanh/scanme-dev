import * as driver from 'bigchaindb-driver';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {flatMap, map} from 'rxjs/operators';
import {logger} from '../../core';
import {Organization} from '../../org-bigchaindb-backend/model/Organization';
import {AssetMetaData} from '../model/AssetMetaData';
import {BigChainTransaction} from '../model/BigChainTransaction';
import {BigchainTransactionId} from '../model/BigchainTransactionId';
import {DivideContent} from '../model/DivideContent';
import {GetHisByTransIdInfo} from '../model/GetHisByTransIdInfo';
import {MetaDataInfo} from '../model/MetaDataInfo';
import {MiddleWareTransaction} from '../model/MiddleWareTransaction';
import {Operation} from '../model/Operation';
import {Output} from '../model/Output';
import {Result} from '../model/Result';
import {TransactionData} from '../model/TransactionData';
import {BigChainService} from '../service/BigChainService';

export class BigChainDBUtil {

    /**
     * transferAsset
     * stransferAsset using for add metadata, transfer asset and burn asset.
     * @param {*} conn - The connection.
     * @param {*} transactionId - The transaction id.
     * @param {*} outputIndex - The output index.
     * @param {*} privateKey - The private key.
     * @param {*} metaData - The metadata.
     * @param {*} receiverPublicKey - The receiver publickey.
     * @returns {*} TransactionData - The TransactionInfoResponse object.
     */
    public static transferAsset(conn, transactionId: string, outputIndex: number, privateKey: string, metaData?, receiverPublicKey?: string): Observable<BigChainTransaction> {
        return this.getTransactionByTxId(conn, transactionId).pipe(flatMap(currentTransaction => {
            logger.info(currentTransaction);
            // Assign amount
            const aMount = currentTransaction.outputs[outputIndex].amount;
            const arrOutputs = [];
            if (receiverPublicKey) {
                // Transfer and Burn
                arrOutputs.push(driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(receiverPublicKey), aMount.toString()));
            } else {
                // Add metadata
                arrOutputs.push(driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(currentTransaction.outputs[outputIndex].public_keys[0]), aMount.toString()));
            }
            // Create a new TRANSFER transaction.
            const transferTransaction = driver.Transaction.makeTransferTransaction(
                // The previous transaction to be chained upon.
                // @ts-ignore
                [{tx: currentTransaction, output_index: outputIndex}],
                // The (output) condition to be fullfilled in the next transaction.
                arrOutputs,
                // Add metadata.
                metaData
            );
            // Sign the new transaction.
            const signedTransaction = driver.Transaction.signTransaction(transferTransaction, privateKey);
            logger.info('signedTransaction', signedTransaction);
            // Post the transaction.
            return BigChainDBUtil.postTransactionByComitMode(conn, signedTransaction);
        }));
    }

    public static divideAsset(conn, transactionId: string, outputIndex: number, privateKey: string, currentPublicKey: string, divideContent: DivideContent[], org: Organization): Observable<BigChainTransaction> {
        // Get transaction
        return this.getTransactionByTxId(conn, transactionId).pipe(flatMap(currentTransaction => {
            logger.info(currentTransaction);
            // get amount
            // Create metadata object.
            const dContent = [];
            const arrAmount = [];
            divideContent.forEach(item => {
                dContent.push(item);
                arrAmount.push(item.amount);
            });
            const mData = {
                'companyid': org._id,
                'providerName': org.organizationName,
                'logo': org.imageUrl,
                'description': org.description,
                'location': org.location,
                'providerAddress': org.organizationAddress,
                'contents': Object.assign({}, dContent), // Convert array to object.
                'noteAction': 'Divide asset',
                'timeStamp': new Date().toISOString()
            };
            const arrOutputs = [];
            arrAmount.forEach(item => {
                const tmp = driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(currentPublicKey), item.toString());
                arrOutputs.push(tmp);
            });
            let updateAssetTransaction;
            // Create a new TRANSFER transaction.
            updateAssetTransaction = driver.Transaction.makeTransferTransaction(
                // previous transaction.
                // @ts-ignore
                [{tx: currentTransaction, output_index: outputIndex}],
                // Create new output.
                arrOutputs,
                // Add metadata.
                mData
            );
            // Sign new transaction.
            const signedTransaction = driver.Transaction.signTransaction(updateAssetTransaction, privateKey);
            logger.info('signedTransaction', signedTransaction);
            // Post the transaction.
            return BigChainDBUtil.postTransactionByComitMode(conn, signedTransaction);
        }));
    }

    /**
     * postTransactionByComitMode
     * Create/Append/Transfer/Divide/Burn transaction based on the currentIdentity, assetData, metaData and amount.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} signedTransaction - The signedTransaction contents.
     * @returns {*} BigChainData - The posted transaction.
     */
    public static postTransactionByComitMode(conn, signedTransaction): Observable<BigChainTransaction> {
        return fromPromise(new Promise((resolve, reject) => {
            // Post the transaction to the network
            conn.postTransactionCommit(signedTransaction).then(successfullyPostedTransaction => {
                // Let the promise resolve the created transaction.
                resolve(successfullyPostedTransaction);
                // Catch exceptions
            }).catch(err => {
                logger.info(err);
                reject(new Error(err));
            });
        }));
    }

    /**
     * getTransactionByTxId
     * Get transaction by current transaction Id.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} transactionId - The currentTxId.
     * @returns {*} BigChainData - The BigChainData that relates to currentTxId.
     */
    public static getTransactionByTxId(conn, transactionId): Observable<BigChainTransaction> {
        return fromPromise(new Promise((resolve, reject) => {
            // Get the transaction
            conn.getTransaction(transactionId).then(bigChainTransaction => {
                // Let the promise resolve the get transaction.
                resolve(bigChainTransaction);
                // Catch exceptions
            }).catch(err => {
                logger.info(err);
                reject(new Error(err));
            });
        }));
    }

    /**
     * getListTxIdOutputs.
     * Get a list of ids and output index of spent or unspent transactions for a certain public key.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} publicKey - The currentIdentity keypair.
     * @param {*} spent - unspent=false; spent=true - The spent attribute of asset.
     * @returns {Array} An array containing all unspent/spent transactions for a certain public key.
     */
    public static getTransactionIdsByPublicKey(conn, publicKey: string, spent?: boolean): Observable<BigchainTransactionId[]> {
        return fromPromise(new Promise((resolve, reject) => {
            // Get a list of ids and output index of unspent/spent transactions from a public key.
            conn.listOutputs(publicKey, spent).then(listTxIdOutputsArr => {
                // Let the promise resolve the get transaction.
                resolve(listTxIdOutputsArr);
                // Catch exceptions
            }).catch(err => {
                logger.info(err);
                reject(new Error(err));
            });
        }));
    }

    /**
     * listTransactions API
     * get all transactions (create and transfer) of an asset.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} assetId - The current transaction Id.
     * @param  operation - The operation of transaction: "CREATE" or "TRANSFER".
     * @returns {*} {Array} An array containing all BigChainData transactions for a certain assetIdentity..
     */
    public static getTransactionsByAsset(conn, assetId: string, operation?: Operation): Observable<BigChainTransaction[]> {
        return fromPromise(new Promise((resolve, reject) => {
            conn.listTransactions(assetId, operation).then(txList => {
                // Let the promise resolve the get transaction.
                    resolve(txList);
                })
                // Catch exceptions
                .catch(err => {
                    logger.info(err);
                    reject(new Error(err));
                });
        }));
    }

    /**
     * getSsearchAssets API
     * Get a asset by str search.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} str - The string search.
     * @returns Asset.
     */
    public static getSsearchAssets(conn, str): Observable<any> {
        return fromPromise(new Promise((resolve, reject) => {
            // Search asset
            conn.searchAssets(str).then(response => {
                resolve(response);
                // Catch exceptions
            }).catch(err => {
                logger.info(err);
                reject(new Error(err));
            });
        }));
    }

    /**
     * getSearchMetadata API
     * Get a metadata by str search.
     * @param {*} conn - The connection of BigchainDB.
     * @param {*} str - The string search.
     * @returns Meatdata.
     */
    public static getSearchMetadata(conn, str): Observable<any> {
        return fromPromise(new Promise((resolve, reject) => {
            // Search metadata
            conn.searchMetadata(str).then(response => {
                resolve(response);
                // Catch exceptions
            }).catch(err => {
                logger.info(err);
                reject(new Error(err));
            });
        }));
    }

} // End class
