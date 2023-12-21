import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {
  getWebcamStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: true });
  }

  constructor() { }
}
