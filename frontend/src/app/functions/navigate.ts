import { NavController } from "@ionic/angular";

function navigate(navCtrl: NavController, page: string) {
  navCtrl.navigateForward(`/${page}`);
}

export { navigate };