import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-loader',
  styleUrl: './loader.css',
  templateUrl: './loader.html',
})
export class Loader {
  @Input() message = 'Loading...';
}
