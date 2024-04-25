import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPeronaIcon } from '../../../stores/user-info/user-info.actions';
import { UploadService } from '../../../services/upload/upload.service';

@Component({
  selector: 'app-persona-result',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './persona-result.component.html',
  styleUrl: './persona-result.component.scss',
})
export class PersonaResultComponent {
  @Input({ required: true }) persona!: IPeronaIcon;

  constructor(private uploadService: UploadService) {}

  getUrl() {
    return this.uploadService.getUrl(this.persona.iconImage);
  }
}
