import { Component,NgZone } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import {BirthdayServiceProvider} from '../../providers/birthday-service/birthday-service';
import {DetailsPage} from '../details/details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public birthdays=[];

  constructor(private birthdayService: BirthdayServiceProvider,
    private nav: NavController,
    private platform: Platform,
    private zone: NgZone,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad HomePage');
    this.platform.ready().then(() => {
      this.birthdayService.initDB();

      this.birthdayService.getAll().then(data => {
        this.zone.run(() => {
          this.birthdays=data;
        });
      }).catch(console.error.bind(console));
    });
  }

  showDetail(birthday){
    let modal=this.modalCtrl.create(DetailsPage, {birthday: birthday});
    modal.present();
  }
}