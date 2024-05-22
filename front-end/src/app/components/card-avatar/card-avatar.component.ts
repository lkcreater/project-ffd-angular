import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserInfoService } from '../../services/user-info/user-info.service';

@Component({
  selector: 'app-card-avatar',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './card-avatar.component.html',
  styleUrl: './card-avatar.component.scss',
})
export class CardAvatarComponent {
  @Input({ required: true }) isUploaded: boolean = false;
  @Input() token!: string;
  @Input() avatar!: string;
  @Output() onUploaded = new EventEmitter<{ file: File; preview: string }>();

  loading: boolean = false;

  constructor(
    private uploadService: UploadService,
    private userInfoService: UserInfoService
  ) {}

  onFileChange(file: FileList | null) {
    this.loading = true;
    if (file) {
      let formData = new FormData();
      formData.append('file', file[0]);

      const url = URL.createObjectURL(file[0]);
      this.avatar = url;

      if (this.isUploaded) {
        this.uploadService
          .uploadFormData(this.token, formData)
          .subscribe((res) => {
            this.loading = false;
            this.avatar = url;
            this.userInfoService
              .updateProfile(this.token, {
                accPicture: res?.file,
              })
              .subscribe((save) => {
                this.userInfoService.fetchUserInfo().subscribe();
                this.onUploaded.emit({
                  file: file[0],
                  preview: url,
                });
              });
          });
      } else {
        this.loading = false;
        this.onUploaded.emit({
          file: file[0],
          preview: url,
        });
      }
    }
  }
}
