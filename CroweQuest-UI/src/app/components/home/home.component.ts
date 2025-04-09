import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private meta: Meta, private title: Title) {
      this.meta.addTags([
        {name: 'description', content: 'Crowequest Home Page'},
        {name: 'author', content: 'Ben Crowe / open-source code'},
        {name: 'keywords', content: 'Genealogy, William, Crowe, Crow, Research, Family History'}

      ]);
      this.setTitle('Crow(e)quest Home Page');
     }

     public setTitle(newTitle: string){
      this.title.setTitle( newTitle);
     }

     
  ngOnInit(): void {
  }

}
