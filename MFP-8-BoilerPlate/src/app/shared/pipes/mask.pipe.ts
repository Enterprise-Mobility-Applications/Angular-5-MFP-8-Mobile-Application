import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mask' })
export class MaskPipe implements PipeTransform {
    mobnumber: string;
    emailid: string;
    lastindex: number;
    firstemailpart: string;
    toBeReplaced;
    resulttext;
    secondemailpart: string;
    maskedemail;
    transform(phrase: string, args: any) {
        const arg1 = args;
        if (arg1 === 'mobile' ) {
            const toBeReplaced = phrase.slice(2, 8);
            return phrase.replace(toBeReplaced, 'xxxxxx');
        } else if (arg1 === 'email' ) {
            this.lastindex = phrase.indexOf('@');
            this.firstemailpart = phrase.substring(0, this.lastindex);
            this.toBeReplaced = this.firstemailpart.slice(2, this.firstemailpart.length - 3);
            this.resulttext = this.firstemailpart.replace(this.toBeReplaced, 'xxxxxx');
            this.secondemailpart = phrase.substring(
              this.lastindex,
              phrase.length
            );
            this.maskedemail = this.resulttext.concat(this.secondemailpart);

            return  this.maskedemail;
        }
    }
}

