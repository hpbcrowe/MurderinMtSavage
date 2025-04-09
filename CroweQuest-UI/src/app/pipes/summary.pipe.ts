/*******
 * This pipe will be used to create a
 * summary or a brief version of a blog
 * to display on a card.
 *
 */

//Implements PIPETRANSFORM

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
})
export class SummaryPipe implements PipeTransform {
  //Takes in a content string, take in the character limit which is  number
  // and it will return a string
  transform(content: string, characterLimit: number): string {
    //If the length of the blog is less than the limit return it
    if (content.length <= characterLimit) {
      return content;
    } else {
      //if it isn't less than the limit return from the start
      //of the blog to the limit. HENCE A SUMMARY
      return `${content.substring(0, characterLimit)}...`;
    }
  }
}
