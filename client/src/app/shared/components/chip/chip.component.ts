import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Chip {
  name?: string,
  phone?: string,
  canDelete?: boolean
}

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'] 
})
export class ChipComponent implements OnInit {
  @Input() chip: Chip
  @Input() canDelete = true
  @Output() delete = new EventEmitter() 
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.chip);
  }
}
