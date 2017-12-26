import { Component, Inject } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController,
  ActionSheetController, ModalController
} from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { DishProvider } from '../../providers/dish/dish';
import { Storage } from '@ionic/storage';

import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  dishcopy = null;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;
  comment: Comment;
  date = new Date();
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private favoriteservice: FavoriteProvider,
    private dishservice: DishProvider,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    @Inject('BaseURL') private BaseURL
  ) {
    console.log(navParams.get('dish'));
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    // this.avgstars = (total / this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + (this.dish.id + 1) + ' added as favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add To Favorites',
          handler: () => {
            this.addToFavorites();
            console.log('Add To Favorites clicked');
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            this.openComment();
            console.log('Add Comment clicked');
          }
        },
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openComment() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(data => {
      this.comment = data;
      console.log(this.comment);
      this.dish.comments.push(this.comment);
      // this.dishservice.submitDish(this.dish, this.dish.id)
      //   .subscribe(
      //   (data: Dish) => { this.dish = data; },
      //   errMess => console.log(errMess)
      //   );
    });
    modal.present();
  }

  onDidDismiss() {

  }

}
