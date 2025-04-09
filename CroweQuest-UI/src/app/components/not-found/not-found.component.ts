import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private meta: Meta, 
    private title: Title
  ) {

    this.meta.addTags([
      {name: 'description', content: 'Crowequest URL not found'},
      {name: 'author', content: 'Ben Crowe / open-source code'},
      {name: 'keywords', content: 'Genealogy, William, Crowe, Crow, Research, Family History'}

    ]);
    this.setTitle('Page Not Found');
}

  ngOnInit(): void {
  }

  public setTitle(newTitle: string){
    this.title.setTitle( newTitle);

  }
}
