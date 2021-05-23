import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchResult } from '../models/MatchResult';

@Component({
  selector: 'app-match-result',
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.scss'],
})
export class MatchResultComponent implements OnInit {
  matchResult: MatchResult;
  resultText: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.matchResult =
      this.router.getCurrentNavigation().extras.state.matchResult;

    if (this.matchResult.myScore > this.matchResult.opponentScore) {
      this.resultText = 'You Won';
    } else if (this.matchResult.myScore < this.matchResult.opponentScore) {
      this.resultText = 'You Lost';
    } else {
      this.resultText = 'Match Tied';
    }
  }
}
