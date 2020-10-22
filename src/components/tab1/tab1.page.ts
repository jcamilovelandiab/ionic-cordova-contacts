import { IfStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContactModalComponent } from '../../modules/contacts/contact-modal.component';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

	public selectedContact: any = null;

	constructor(
		public modalController: ModalController,
	) {
	}

	async openContactPage() {
		const modal = await this.modalController.create({
			component: ContactModalComponent,
			cssClass: 'contact-modal-component'
		});
		modal.onDidDismiss()
			.then(({ data }) => {
				console.log(data);
				if ( !!data && !data.dismissed && data.selectedContact) {
					const phoneNumber = data.selectedContact.phoneNumber === undefined ? "" :
						data.selectedContact.phoneNumber;
					const name = data.selectedContact.phoneNumber === undefined ? "" :
						data.selectedContact.displayName;
					this.selectedContact = { name, phoneNumber }
				}
			});
		return await modal.present();
	}

}
