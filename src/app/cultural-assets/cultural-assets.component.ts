import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-cultural-assets',
  templateUrl: './cultural-assets.component.html',
  styleUrls: ['./cultural-assets.component.css']
})
export class CulturalAssetsComponent implements OnInit, AfterViewInit {
  private map;
  rows = [
    [{titolo: 'Titolo 1', desc: 'Desc 1'},
    {titolo: 'Titolo 2', desc: 'Desc 2'},
    {titolo: 'Titolo 3', desc: 'Desc 3'}],
    [{titolo: 'Titolo 4', desc: 'Desc 4'},
    {titolo: 'Titolo 5', desc: 'Desc 5'},
    {titolo: 'Titolo 6', desc: 'Desc 6'}],
    [{titolo: 'Titolo 7', desc: 'Desc 7'},
    {titolo: 'Titolo 8', desc: 'Desc 8'}]
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Initialize map
   * 
   */
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.50, 12.51],
      zoom: 5
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

}
