import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UploadService } from '../../../services/upload/upload.service';
import { firstValueFrom } from 'rxjs';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import { CardAvatarComponent } from '../../card-avatar/card-avatar.component';
import { IInfoProfile } from '../../../stores/user-info/user-info.actions';
import { IUserInfoData } from '../../../stores/user-info/user-info.reducer';

@Component({
  selector: 'app-input-info-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    CardAvatarComponent,
  ],
  templateUrl: './input-info-profile.component.html',
  styleUrl: './input-info-profile.component.scss'
})
export class InputInfoProfileComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<{
    status: boolean,
    updated: any
  }>();

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private uploadService: UploadService,
    private userInfoService: UserInfoService
  ) {}

  validateForm: FormGroup<{
    userName: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
  });

  token!: string;
  userInfoData!: IUserInfoData<IInfoProfile>;
  fileAvatar: File | null = null;

  ngOnInit(): void {
    this.token = this.userInfoService.getToken() ?? '';
    this.userInfoService.getUserInfo().subscribe(res => {
      this.userInfoData = res;
      this.validateForm.controls.userName.setValue(this.userInfoData.userInfo?.accFirstname);
    });
  }

  onUploadAvatar(data: { file: File, preview: string }) {
    if(data.file) {
      this.fileAvatar = data.file;
    }
  }

  async actionSubmit() {
    if (this.validateForm.valid && this.token) {
      let image = null;

      if(this.fileAvatar) {
        let formData = new FormData();
        formData.append('file', this.fileAvatar);
        image = await firstValueFrom(this.uploadService.uploadFormData(this.token, formData))
      }

      let body = {
        accFirstname: this.validateForm.controls.userName.value
      }
      if(image){
        Object.assign(body, {
          accPicture: image.file
        })
      }
      const updated = await firstValueFrom(this.userInfoService.updateProfile(this.token, body));
      if(updated) {
        this.userInfoService.setUserInfo(this.token).subscribe(userInfo => {
          this.onSubmit.emit({
            status: true,
            updated
          })
        });
      }else{
        this.onSubmit.emit({
          status: false,
          updated
        })
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
