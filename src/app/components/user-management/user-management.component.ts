import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { UserService, UserAdmin } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserAdmin[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'teamName', 'isActive'];

  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  toggleActive(user: UserAdmin) {
    if (user.role === 'Admin') {
      this.snackBar.open('Cannot deactivate Admin users', 'Close', { duration: 2000 });
      user.isActive = true; // reset toggle visually
      return;
    }

    this.userService.toggleActive(user.id).subscribe({
      next: () => {
        this.snackBar.open('User status updated', 'Close', { duration: 2000 });
      },
      error: () => {
        user.isActive = !user.isActive; // revert on error
        this.snackBar.open('Failed to update status', 'Close', { duration: 2000 });
      }
    });
  }
}
