import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PollService, Poll } from '../../services/poll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './home-feed.component.html',
  styleUrls: ['./home-feed.component.css']
})
export class HomeFeedComponent implements OnInit {
  polls: Poll[] = [];
  
  pageIndex = 0;
  pageSize = 10;
  totalLength = 100; // Will be updated if API supports total count

  searchQuery = '';
  sortOption = 'newest';

  private pollService = inject(PollService);

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls(this.pageIndex + 1, this.pageSize, this.searchQuery, this.sortOption)
      .subscribe(res => {
        this.polls = res;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPolls();
  }

  onSearchChange() {
    this.pageIndex = 0;
    this.loadPolls();
  }
}
