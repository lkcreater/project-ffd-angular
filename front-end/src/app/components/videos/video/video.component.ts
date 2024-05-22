import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements OnInit {
  @Input({ required: true }) url!: string;
  @Input({ required: true }) title!: string;
  @Input() cateName: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }

  player!: any;
  isVisible: boolean = false;

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openModalVideo() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

}
