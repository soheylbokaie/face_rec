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
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../http-service.service';
import { Router } from '@angular/router';

const socket = io.connect('https://localhost:5000');

@Component({
  selector: 'app-verf-cam',
  standalone: true,
  imports: [],
  templateUrl: './verf-cam.component.html',
  styleUrl: './verf-cam.component.css',
})
export class VerfCamComponent implements OnInit, AfterViewInit {
  constructor(
    private socketService: SocketService,
    private webcamService: WebcamService,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private myHttpService: HttpServiceService
  ) {}

  intervalTime = 250;
  message: string = '';
  test = 5;
  receivedMessage: string = '';
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  video = document.getElementById('webcam-video') as HTMLVideoElement;
  isBlinkingl = false;
  isBlinkingr = false;
  directions: Array<number> = [0, 0, 0];
  verfied: Array<number> = [0, 0, 0];
  direction_comand: Array<string> = ['Left', 'Front', 'Right'];
  decodedToken: any = '';
  start = true;
  user_details: any;
  left = false;
  front = false;
  right = false;
  blur = false;
  sent = false;
  randomIndex = 0;
  image: any;
  ngOnInit(): void {
    try {
      const queryParams = this.route.snapshot.queryParams;
      // this.decodedToken = jwt_decode.jwtDecode(queryParams['token']);
      this.user_details = {
        user_id: queryParams['user_id'],
        election_id: queryParams['election_id'],
      };

      this.chooseNumber();
    } catch (error) {}

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
          if (this.start == true) {
            if (data['direction'] == 'Left' && this.randomIndex == 0) {
              this.directions[0] += 1;
              this.directions[1] = 0;
              this.directions[2] = 0;
            } else if (data['direction'] == 'Right' && this.randomIndex == 2) {
              this.directions[2] += 1;
              this.directions[0] = 0;
              this.directions[1] = 0;
            } else if (data['direction'] == 'Front' && this.randomIndex == 1) {
              this.directions[1] += 1;
              this.directions[2] = 0;
              this.directions[0] = 0;
            }
            if (this.direction_comand[this.randomIndex] != data['direction']) {
              this.video.classList.add('blur-effect');
              this.blur = true;
            } else {
              this.video.classList.remove('blur-effect');
              this.blur = false;
              if (this.directions[this.randomIndex] % 13 == 0) {
                this.verfied[this.randomIndex] = 1;
                this.chooseNumber();
              }
            }
          }
          console.log(data);

          if (data.hasOwnProperty('image')) {
            this.image = data['image'];
          }
          if (
            this.verfied[0] == 1 &&
            this.verfied[1] == 1 &&
            this.verfied[2] == 1 &&
            this.sent == false
          ) {
            this.sent = true;
            const data_to_send = {
              image: this.image,
              user_id: this.user_details['user_id'],
              election_id: this.user_details['election_id'],
            };

            this.myHttpService
              .verfPicture(data_to_send)
              .subscribe((result: any) => {
                console.log(result);
                window.location.href =
                  'http://localhost:3000/elections/' +
                  this.user_details['election_id'] +
                  '?face_reco_token=' +
                  result['hash'];
              });
          }
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
    socket.emit('get_image', {
      img: frameDataUrl,
      name: this.user_details['user_id'],
      state: this.directions[1],
    });
  }

  testsss() {
    if (this.test == 3) {
      setInterval(() => {
        this.isBlinkingr = !this.isBlinkingr;
      }, 1000);
    }
  }

  chooseNumber() {
    this.randomIndex = Math.floor(Math.random() * 3);
    // Replace this with the logic to get the chosen number
    while (this.verfied[this.randomIndex] == 1) {
      if (
        this.verfied[0] == 1 &&
        this.verfied[1] == 1 &&
        this.verfied[2] == 1
      ) {
        break;
      }
      this.randomIndex = Math.floor(Math.random() * 3);
    }
  }
}
