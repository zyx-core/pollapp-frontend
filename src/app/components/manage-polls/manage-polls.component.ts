import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PollService, Poll } from '../../services/poll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-polls',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './manage-polls.component.html',
  styleUrls: ['./manage-polls.component.css']
})
export class ManagePollsComponent implements OnInit {
  polls: Poll[] = [];
  displayedColumns: string[] = ['title', 'status', 'startDate', 'endDate', 'totalVotes', 'publishResults', 'actions'];
  
  pageIndex = 0;
  pageSize = 10;
  totalLength = 100;

  private pollService = inject(PollService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls(this.pageIndex + 1, this.pageSize).subscribe(res => {
      this.polls = res;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPolls();
  }

  togglePublish(poll: Poll) {
    this.pollService.togglePublish(poll.id, poll.resultsPublished).subscribe({
      next: () => {
        this.snackBar.open('Publish status updated', 'Close', { duration: 2000 });
      },
      error: (err) => {
        poll.resultsPublished = !poll.resultsPublished; // Revert on error
        this.snackBar.open('Failed to update status', 'Close', { duration: 2000 });
      }
    });
  }

  closePoll(poll: Poll) {
    this.pollService.closePoll(poll.id).subscribe({
      next: () => {
        poll.status = 'Closed';
        this.snackBar.open('Poll closed successfully', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to close poll', 'Close', { duration: 2000 });
      }
    });
  }

  deletePoll(poll: Poll) {
    // Note: window.confirm is auto-dismissed in some embedded browsers,
    // causing the deletion to silently cancel. Executing deletion directly.
    this.pollService.deletePoll(poll.id).subscribe({
      next: () => {
        this.loadPolls();
        this.snackBar.open('Poll deleted', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to delete poll', 'Close', { duration: 2000 });
      }
    });
  }
}
