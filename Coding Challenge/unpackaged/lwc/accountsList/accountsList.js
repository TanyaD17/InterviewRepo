import { LightningElement, wire, track } from 'lwc';
import getFinancialAccounts from '@salesforce/apex/AccountsListController.getFinancialAccounts';

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
    @track sortBy;
    @track sortDirection;

    @wire(getFinancialAccounts) 
    wiredAccount({error,data}) {
        if (data) {
            let tempRecs = [];
            data.forEach( ( record ) => {
                let tempRec = Object.assign( {}, record );  
                tempRec.AccountName = '/' + tempRec.Id;
                tempRecs.push( tempRec );
                
            });
            this.returnedAccounts = tempRecs;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.returnedAccounts = undefined;
        }
    };
    
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.returnedAccounts));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.returnedAccounts = parseData;
    }    
    
}