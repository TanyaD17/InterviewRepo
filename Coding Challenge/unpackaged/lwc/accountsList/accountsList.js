import { LightningElement, wire, track } from 'lwc';
import getFinancialAccounts from '@salesforce/apex/AccountsListController.getFinancialAccounts';

//datable columns
const columns = [
    {
        label: 'Account Name',
        fieldName: 'AccountName',
        type: 'url',
            typeAttributes: {label: { fieldName: 'Name' }, 
            target: '_blank'},
        sortable: "true"
    }, {
        label: 'Account Owner',
        fieldName: 'Owner.Name',
        sortable: "true"
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'Phone'
    }, {
        label: 'Website',
        fieldName: 'Website',
        type: 'Picklist'
    }, {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'Currency'
    },
];

export default class AccountsList extends LightningElement {

    @track returnedAccounts;
    @track columns = columns;
    @track sortField;
    @track ascOrDesc;

    //apex call
    @wire(getFinancialAccounts) 
    wiredAccount({error,data}) {
        if (data) {
            let tempRecs = [];
            data.forEach( ( record ) => {
                let tempRec = Object.assign( {}, record );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                window.console.log('record'+record);
                
            });
            this.returnedAccounts = tempRecs;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.returnedAccounts = undefined;
        }
    };
    
    //method
    handleSort(event) {
        this.sortField = event.detail.fieldName;
        this.ascOrDesc = event.detail.direction;
        this.sort(this.sortField, this.ascOrDesc);
    }

    sort(field, direction) {
        let tempData = JSON.parse(JSON.stringify(this.returnedAccounts));

        let keyValue = (a) => {
            return a[field];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        tempData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.returnedAccounts = tempData;
    }    
    
}