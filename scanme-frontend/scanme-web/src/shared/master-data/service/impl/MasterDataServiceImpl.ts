import {Observable, of} from 'rxjs';
import {ValueText} from '../../../../core';
import {MasterDataService} from '../MasterDataService';

export class MasterDataServiceImpl implements MasterDataService {
  private status = [
    {
      value: 'T',
      text: 'Activated',
    },
    {
      value: 'F',
      text: 'Deactivated',
    }
  ];

  private ctrlStatus = [
    {
      value: 'P',
      text: 'Pending',
    },
    {
      value: 'A',
      text: 'Approved',
    },
    {
      value: 'R',
      text: 'Rejected',
    }
  ];

  private actionStatus = [
    {
      value: 'C',
      text: 'Created',
    },
    {
      value: 'U',
      text: 'Updated',
    },
    {
      value: 'D',
      text: 'Deleted',
    }
  ];

  private entityTypes = [
    {
      value: 'B',
      text: 'Bank',
    },
    {
      value: 'E',
      text: 'Payee',
    },
    {
      value: 'R',
      text: 'Payer',
    }
  ];

  private roleTypes = [
    {
      value: 'M',
      text: 'Maker',
    },
    {
      value: 'C',
      text: 'Checker',
    }
  ];

  private webServiceTypes = [
    {
      value: 'HO',
      text: 'Hold',
    }
  ];

  private userTypes = [
    {
      value: 'BA',
      text: 'Bank Admin',
    }
  ];
  private userActivityLogs = [
    {
      value: 'CP',
      text: 'Change Password',
    },
    {
      value: 'DCFP',
      text: 'DSO Cancel Future Payment',
    },
    {
      value: 'DFAA',
      text: 'Dealer Financing - Accept Agreement',
    },
    {
      value: 'DFAC',
      text: 'Dealer Financing - Agree Terms and Conditions',
    },
    {
      value: 'DFPA',
      text: 'Dealer Financing - Print Agreement',
    },
    {
      value: 'DFSA',
      text: 'Dealer Financing - Sign Agreement',
    },
    {
      value: 'IP',
      text: 'Initial Payment',
    },
    {
      value: 'L',
      text: 'Login',
    },
    {
      value: 'LG',
      text: 'Logout',
    },
    {
      value: 'P',
      text: 'Payment',
    },
    {
      value: 'US',
      text: 'Unauthorized Session',
    }
  ];

  private titles = [
    { text: 'Mr', value: 'Mr' },
    { text: 'Mrs', value: 'Mrs' },
    { text: 'Ms', value: 'Ms' },
    { text: 'Dr', value: 'Dr' }
  ];

  private positions = [
    { value: 'E', text: 'Employee' },
    { value: 'M', text: 'Manager' },
    { value: 'D', text: 'Director' }
  ];

  private genders = [
    { value: 'M', text: 'Male' },
    { value: 'F', text: 'Female' }
  ];
  private transactionFeeRules = [
    { value: 'fix-per', text: 'Fix Per Transaction' },
    { value: 'sb', text: 'Slab Basic' },
    { value: 'tb', text: 'Tier Basic' },
    { value: 'ufc', text: 'Utility Fee Charging' }
  ];

  private defaultAccounts = [
    { value: '110', text: 'Cash' },
    { value: '111', text: 'Notes receivable' },
    { value: '112', text: 'Accounts receivable' },
    { value: '113', text: 'Interest receivable' },
    { value: '115', text: 'Merchandise invenstorey' },
    { value: '116', text: 'Office supplies' },
    { value: '117', text: 'Prepaid insurance' },
    { value: '120', text: 'Land' },
    { value: '123', text: 'Store equipment' },
    { value: '124', text: 'Accumulated depreciation store equipment' },
    { value: '125', text: 'Office equipment' },
    { value: '126', text: 'Accumulated depreciation office equipment' },
    { value: '210', text: 'Accounts payable' },
    { value: '211', text: 'Salaries payable' },
    { value: '212', text: 'Unearned rent' },
    { value: '215', text: 'Notes payable' },
    { value: '310', text: 'Capital Stock' },
    { value: '311', text: 'Retained earnings' },
    { value: '312', text: 'Dividends' },
    { value: '313', text: 'Income summary' },
    { value: '410', text: 'Sales' },
    { value: '411', text: 'Sales returns and allowances' },
    { value: '412', text: 'Sales discount' },
    { value: '510', text: 'Cost of goods sold' },
    { value: '520', text: 'Sales salaries expense' },
    { value: '521', text: 'Advertising expense' },
    { value: '522', text: 'Depreciation expense-store equipment' },
    { value: '529', text: 'Miscellaneous selling expense' },
    { value: '530', text: 'Office salaries expense' },
    { value: '531', text: 'Rent expense' },
    { value: '532', text: 'Depreciation expense-office equipment' },
    { value: '533', text: 'Insurance expense' },
    { value: '534', text: 'Office supplies expense' },
    { value: '539', text: 'Miscellaneous admin' },
    { value: '610', text: 'Rent income' },
    { value: '611', text: 'Interest income' },
    { value: '710', text: 'Interest expense' }
  ];

  private paymentAmount = [
    {
      value: 'B',
      text: 'BETWEEN',
    },
    {
      value: 'E',
      text: 'EQUAL',
    },
    {
      value: 'GT',
      text: 'GREATER THAN',
    },
    {
      value: 'BTOR',
      text: 'GREATER THAN OR EQUAL',
    },
    {
      value: 'LT',
      text: 'LESS THAN',
    },
    {
      value: 'LTOE',
      text: 'LESS THAN OR EQUAL',
    }
  ];

  private paymentStatus = [
    { value: 'D', text: 'Debited'},
    { value: 'C', text: 'Credited'},
    { value: 'F', text: 'Fail'},
    { value: 'S', text: 'Success'},
  ];

  private postingType = [
    { value: 'I', text: 'Immediately'},
    { value: 'D', text: 'Daily'},
    { value: 'M', text: 'Monthly'},
  ];

  private feeStatus = [
    { value: '', text: 'Both'},
    { value: 'C', text: 'Processed'},
    { value: 'S', text: 'Unprocessed'},
  ];

  getDefaultAcounts(): Observable<ValueText[]> {
    return of(this.defaultAccounts);
  }

  getTransactionFeeRules(): Observable<ValueText[]> {
    return of(this.transactionFeeRules);
  }

  getGenders(): Observable<ValueText[]> {
    return of(this.genders);
  }

  getTitles(): Observable<ValueText[]> {
    return of(this.titles);
  }

  getPositions(): Observable<ValueText[]> {
    return of(this.positions);
  }

  getStatus(): Observable<ValueText[]> {
    return of(this.status);
  }

  getCtrlStatus(): Observable<ValueText[]> {
    return of(this.ctrlStatus);
  }

  getActionStatus(): Observable<ValueText[]> {
    return of(this.actionStatus);
  }

  getEntityTypes(): Observable<ValueText[]> {
    return of(this.entityTypes);
  }

  getRoleTypes(): Observable<ValueText[]> {
    return of(this.roleTypes);
  }

  getUserTypes(): Observable<ValueText[]> {
    return of(this.userTypes);
  }
  getUserActivityLogs(): Observable<ValueText[]> {
    return of(this.userActivityLogs);
  }
  getWebServiceTypes(): Observable<ValueText[]> {
    return of(this.webServiceTypes);
  }
  getPaymentAmount(): Observable<ValueText[]> {
    return of(this.paymentAmount);
  }

  getPaymentStatus(): Observable<ValueText[]> {
    return of(this.paymentStatus);
  }

  getPostingType(): Observable<ValueText[]> {
    return of(this.postingType);
  }

  getFeeStatus(): Observable<ValueText[]> {
    return of(this.feeStatus);
  }
}
