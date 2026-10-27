import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-error-message',
  styleUrl: './error-message.css',
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  @Input() message = 'Something went wrong.';

  @Output() retry = new EventEmitter<void>();
}
