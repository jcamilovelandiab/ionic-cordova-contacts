import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { searchPhoneContacts } from '../phone-contacts-plugin';

/**
 * @author Juan Camilo Velandia Botello.
 */
@Component({
    selector: 'contact-modal-component',
    templateUrl: './contact-modal.component.html',
    styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

    
    private page: number = 1;//Represents the next page
    private limitContactsPerPage: number = 15;//Contact limit per page.
    private enablePagination: Boolean = false;

    private contacts: any[];//An array with all saved contacts in the phone
    public displayContacts: any[];//All contacts displayed on the screen

    constructor(
        private modalCtrl: ModalController,
    ) {
    }

    ngOnInit(){
        console.log('searching contacts...');
        this.searchContacts();
    }

    /**
     * This function loads all saved contacts in the phone.
     * It was necessary to define promises to control the plugin responses.
     */
    searchContacts(){
        searchPhoneContacts({
            success: (contacts) => {
                console.log(contacts);
                this.contacts = contacts;
                this.displayContacts = contacts;
            }, error: (error) => {
                console.log(error);
            }
        });
    }

    dismissModal() {
        // Using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    /**
     * Feature to load contacts per page and display the "loading more contacts" message
     * at the bottom of the screen
     * @param event 
     */
    loadNextPage(event: any) {
        if (!this.enablePagination) return; //pagination is not enabled.
        const low = this.limitContactsPerPage*this.page;
        const high = low+this.limitContactsPerPage;
        const moreData = this.contacts.slice(low, high);
        setTimeout(() => {
            console.log('Done');
            event.target.complete();
            this.displayContacts = [...this.displayContacts, ...moreData];
            this.page++;
            console.log(this.displayContacts.length, this.contacts.length);
            if (this.contacts.length == this.displayContacts.length) {
                event.target.disabled = true;
            }
        }, 200);
    }

    /**
     * 
     * @param phone The selected contact's phone number
     * @param index The array index where the selected contact is located     
     * @param displayName The selected contact's name
     */
    selectContact(phone: string, index: number, displayName: string){
        this.modalCtrl.dismiss({
            'selectedContact': {
                displayName,
                'phoneNumber': phone.replace(/ /g, ''),
                'contactIndex': index,
            },
            'dismissed': false
        });
    }

}