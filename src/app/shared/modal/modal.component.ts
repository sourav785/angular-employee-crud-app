import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Output() closeModalOutput: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  onCloseModel() {
    this.closeModalOutput.emit(false);
  }
}
