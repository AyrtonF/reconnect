import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideMenuComponentModule } from './components/side-menu/side-menu.module'; 
import { AddVideoModalComponent } from './components/add-video-modal/add-video-modal.component';
import { AddQuestionModalComponent } from './components/add-question-modal/add-question-modal.component';
import { AddMaterialModalComponent } from './components/add-material-modal/add-material-modal.component';

@NgModule({
  declarations: [AppComponent,],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    SideMenuComponentModule 
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}