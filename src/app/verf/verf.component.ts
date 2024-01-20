import { Component } from '@angular/core';
import { VerfCamComponent } from '../verf-cam/verf-cam.component';

@Component({
  selector: 'app-verf',
  standalone: true,
  imports: [VerfCamComponent],
  templateUrl: './verf.component.html',
  styleUrl: './verf.component.css'
})
export class VerfComponent {

}
