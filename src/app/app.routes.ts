import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { MainComponent } from './main/main.component';
import { VerfCamComponent } from './verf-cam/verf-cam.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'verf', component: VerfCamComponent },
];
