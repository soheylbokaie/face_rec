import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { WebcamService } from '../webcam.service';
import { SocketService } from '../socket.service';
import * as io from 'socket.io-client';
import { interval, Subscription } from 'rxjs';

const socket = io.connect('https://127.0.0.1:5000');
@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent implements OnInit, AfterViewInit {
  constructor(
    private socketService: SocketService,
    private webcamService: WebcamService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  intervalTime = 200;
  message: string = '';
  test = 5;
  receivedMessage: string = '';
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  video = document.getElementById('webcam-video') as HTMLVideoElement;
  isBlinkingl = false;
  isBlinkingr = false;
  counts: Array<number> = [0, 0, 0];
  ngOnInit(): void {
    this.initializeWebcam();
  }
  ngAfterViewInit(): void {
    this.video = document.getElementById('webcam-video') as HTMLVideoElement;
    const source = interval(this.intervalTime);

    source.subscribe(() => {
      this.captureAndSend();
    });
    this.setOvalMaskStyles();
  }

  initializeWebcam(): void {
    this.webcamService
      .getWebcamStream()
      .then((stream: MediaStream) => {
        this.video.srcObject = stream;
        socket.connect();
        this.canvas.width = 400; 
        this.canvas.height = 300; 
        socket.on('data', (data) => {
          if (data['direction'] == 'left') {
            this.counts[0] += 1;
            this.counts[1] = 0;
            this.counts[2] = 0;
          } else if (data['direction'] == 'right') {
            this.counts[2] += 1;
            this.counts[0] = 0;
            this.counts[1] = 0;
          } else if (data['direction'] == 'front') {
            this.counts[1] += 1;
            this.counts[2] = 0;
            this.counts[0] = 0;
          }

          if (this.counts[1] % 5 == 0 && this.counts[1] != 0) {
            if (this.counts[1] == 5) {
              this.test = 5;
            }
            if (this.test >= 1) {
              this.test -= 1;
              this.isBlinkingr = true;
              this.isBlinkingl = true;
            } else {
              this.isBlinkingl = false;
              this.isBlinkingr = false;
            }
          } else if (this.counts[0] % 5 == 0 && this.counts[0] != 0) {
            if (this.counts[0] == 5) {
              this.test = 5;
            }
            if (this.test >= 1) {
              this.test -= 1;
              this.isBlinkingl = false;
              this.isBlinkingr = true;
            } else {
              this.isBlinkingl = false;
              this.isBlinkingr = false;
            }
          } else if (this.counts[2] % 5 == 0 && this.counts[2] != 0) {
            if (this.counts[2] == 5) {
              this.test = 5;
            }
            if (this.test >= 1) {
              this.isBlinkingl = true;
              this.isBlinkingr = false;
              this.test -= 1;
            } else {
              this.isBlinkingl = false;
              this.isBlinkingr = false;
            }
          }

          console.log(this.counts);
        });
      })
      .catch((error: any) => {
        console.error('Error accessing webcam:', error);
      });
    this.video.onplay = () => {
      this.captureAndSend();
    };
  }

  private setOvalMaskStyles(): void {
    const ovalMask = this.renderer.createElement('div');
    this.renderer.addClass(ovalMask, 'oval-mask');

    const radialGradient =
      'radial-gradient(ellipse at center, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%)';
    this.renderer.setStyle(ovalMask, 'background', radialGradient);
    this.renderer.setStyle(ovalMask, 'pointer-events', 'none');
    this.renderer.setStyle(ovalMask, 'z-index', '2');

    // Append the oval mask to the video container
    const videoContainer =
      this.el.nativeElement.querySelector('#video-container');
    this.renderer.appendChild(videoContainer, ovalMask);
  }

  captureAndSend() {
    this.context?.drawImage(
      this.video,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const frameDataUrl = this.canvas.toDataURL('image/jpeg');
    socket.emit('get_image', { img: frameDataUrl, name: 'nkljnk' });
  }

  testsss() {
    if (this.test == 3) {
      setInterval(() => {
        this.isBlinkingr = !this.isBlinkingr;
      }, 1000);
    }
  }
}
