import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {BirthdayServiceProvider} from '../../providers/birthday-service/birthday-service';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  public birthday: any={};
  public isNew=true;
  public action='Add';
  public isoDate='';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public birthdayService: BirthdayServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
    let editBirthday=this.navParams.get('birthday');

    if(editBirthday){
      this.birthday=editBirthday;
      this.isNew=false;
      this.action='Edit';
      this.isoDate=this.birthday.Date.toISOString().slice(0,10);
    }
  }
  
  save(){
    this.birthday.Date=new Date(this.isoDate);

    if(this.isNew){
      this.birthdayService.add(this.birthday).catch(console.error.bind(console));
    }
    else{
      this.birthdayService.update(this.birthday).catch(console.error.bind(console));
    }

    this.dismiss();
  }

  delete(){
    this.birthdayService.delete(this.birthday).catch(console.error.bind(console));

    this.dismiss();
  }

  dismiss(){
    this.viewCtrl.dismiss(this.birthday);
  }
}