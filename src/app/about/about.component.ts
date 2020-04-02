import { Component, OnInit } from '@angular/core';
import {LeaderService} from '../services/leader.service';
import {Leader} from '../shared/Leader';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders:Leader[];
  selectedLeader: Leader;
  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
    this.leaders=this.leaderService.getLeaders();
  }
  onSelect(leader:Leader){
    this.selectedLeader=leader;

  }
}
