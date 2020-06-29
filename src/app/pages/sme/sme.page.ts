import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sme',
  templateUrl: './sme.page.html',
  styleUrls: ['./sme.page.scss'],
})
export class SmePage {

  constructor(
    private serviceNavigation: NavController,
  ) { }

  goBack() { this.serviceNavigation.back(); }
}
