import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {
  story;
  contenuto;

  constructor() { }

  ngOnInit(): void {
    this.contenuto = '<h2 class="text-center">Storia numero uno</h2><h5 class="text-center">Sottotitolo</h5><p>Paragrafo 1</p><p class="text-success">Paragrafo 2</p><ul><li>Uno</li><li>Due</li><li>Tre</li></ul>';
  }

}
