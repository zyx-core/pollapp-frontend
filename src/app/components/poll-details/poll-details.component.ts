import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PollService, Poll } from '../../services/poll.service';
import { CommentService, Comment } from '../../services/comment.service';
import { SvgChartComponent, ChartData } from '../shared/svg-chart/svg-chart.component';

@Component({
  selector: 'app-poll-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
    SvgChartComponent
  ],
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.css']
})
export class PollDetailsComponent implements OnInit {
  pollId: string = '';
  poll: Poll | null = null;
  comments: Comment[] = [];
  
  voteForm: FormGroup;
  commentForm: FormGroup;
  
  hasVoted = false; // Note: In a real app, this should come from the API if user has already voted
  chartData: ChartData[] = [];

  private route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.voteForm = this.fb.group({
      selectedOptionId: ['', Validators.required]
    });

    this.commentForm = this.fb.group({
      commentText: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.pollId = this.route.snapshot.paramMap.get('id') || '';
    if (this.pollId) {
      this.loadPoll();
      this.loadComments();
    }
  }

  loadPoll() {
    this.pollService.getPollById(this.pollId).subscribe(res => {
      this.poll = res;
      this.updateChartData();
    });
  }

  loadComments() {
    this.commentService.getComments(this.pollId).subscribe(res => {
      this.comments = res;
    });
  }

  updateChartData() {
    if (this.poll && this.poll.options) {
      this.chartData = this.poll.options.map(opt => ({
        label: opt.optionText,
        value: opt.votesCount || 0 // Assuming votesCount comes from backend or we calculate it
      }));
    }
  }

  onVoteSubmit() {
    if (this.voteForm.valid && this.poll) {
      this.pollService.castVote(this.poll.id, this.voteForm.value.selectedOptionId).subscribe({
        next: () => {
          this.snackBar.open('Vote cast successfully!', 'Close', { duration: 3000 });
          this.hasVoted = true;
          this.loadPoll(); // Refresh to see updated results
        },
        error: (err) => {
          this.snackBar.open(err.error?.error || 'Error casting vote', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCommentSubmit() {
    if (this.commentForm.valid && this.poll) {
      this.commentService.addComment(this.poll.id, this.commentForm.value.commentText).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadComments();
        },
        error: (err) => {
          this.snackBar.open(err.error?.error || 'Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
