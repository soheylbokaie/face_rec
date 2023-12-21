import { Component } from '@angular/core';
import { CameraComponent } from '../camera/camera.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CameraComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
