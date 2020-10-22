import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ContactModalComponent } from './contact-modal.component';

@NgModule({
    declarations: [
        ContactModalComponent
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [ContactModalComponent]
  
})
export class ContactModalComponentModule {}