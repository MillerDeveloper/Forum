import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'serverFiles'
})
export class ServerFilesPipe implements PipeTransform {
  transform(string: string): string {    
    if(string) {
      return `${environment.server}/api/file/?path=${string?.split('/')?.join('+')}` 
    } else {
      return '../../../assets/images/no-avatar.png'
    }
  }

}
