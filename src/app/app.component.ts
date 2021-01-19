import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private renderer: Renderer2) {
    this.captures = [];
  }

  @ViewChild('video', { static: true }) videoElement: ElementRef;

  constraints = {
    audio: false,
    video: {
      facingMode: 'environment',
      width: { ideal: 320 },
      height: { ideal: 240 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  public captures: Array<any>;

  stream: MediaStream;

  errorHandle = '';

  ngOnInit() {
    // this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then(stream => this.cameraSuccess(null, stream)).catch(error => this.handleError(error));
    } else {
      console.log('Sorry, camera not available.');
    }
  }

  cameraSuccess(e, stream: MediaStream) {
    // tslint:disable-next-line: variable-name
    const _this = this;
    _this.errorHandle = '';
    _this.stream = stream;
    _this.attachVideo(stream);
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  capture() {
    console.log(this.videoElement.nativeElement.src);
    const data = { files: [this.getBlob()], autoUpload: true };
    // console.log(data);
    this.captures.push(this.getDataUri());
    console.log(this.captures);
    this.sendData(this.getDataUri());
  }

  sendData(file) {
    // console.log('final => ', file);
  }

  getBlob() {
    const dataUri = this.getDataUri();
    const base64 = dataUri.split('data:image/jpeg;base64,')[1];
    const binary = this.encode(base64);
    const blob: any = new Blob([binary], { type: 'image/jpeg' });
    blob.name = 'camera' + Math.round(Math.random() * 1000) + '.jpg';
    blob.lastModifiedDate = new Date();
    return blob;
  }

  encode(base64) {
    const bin = atob(base64);
    const len = bin.length;
    const ab = new ArrayBuffer(len);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < len; i++) {
      ua[i] = bin.charCodeAt(i);
    }
    return ab;
  }

  getDataUri() {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoElement.nativeElement, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }

  handleError(error) {
    // console.log('Error: ', error);
    const err = error;
    console.log(err);
    this.errorHandle = err;
  }

  stopCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      if (this.stream) {
        if (this.stream.getVideoTracks) {
          const tracks = this.stream.getVideoTracks();
          if (tracks && tracks[0] && tracks[0].stop) {
            tracks[0].stop();
          }
        }
        delete this.stream;
        this.videoElement.nativeElement.pause();
        this.videoElement.nativeElement.src = '';
      }
    } else {
      console.log('Sorry, camera not available.');
    }
  }

}
