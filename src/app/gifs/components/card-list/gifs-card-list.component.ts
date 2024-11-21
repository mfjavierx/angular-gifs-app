import { Component, Input } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card-list',
  templateUrl: './gifs-card-list.component.html',
  styleUrl: './gifs-card-list.component.css'
})
export class CardListComponent {
  @Input()
  public gifs: Gif[] = [];
}
