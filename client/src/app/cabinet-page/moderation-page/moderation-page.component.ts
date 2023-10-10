import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-moderation-page',
  templateUrl: './moderation-page.component.html',
  styleUrls: ['./moderation-page.component.scss']
})
export class ModerationPageComponent implements OnInit {

  constructor() { }
  notSelected: boolean = true

  ngOnInit(): void {

  } 
}
