import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PollService } from '../../services/poll.service';

import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent {
  pollForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading = false;
  
  private fb = inject(FormBuilder);
  private pollService = inject(PollService);
  private uploadService = inject(UploadService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.pollForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
      enableVoting: [true],
      enableComments: [true],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), Validators.required], // +7 days
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.pollForm.valid) {
      if (this.selectedFile) {
        this.isUploading = true;
        this.uploadService.uploadImage(this.selectedFile).subscribe({
          next: (res) => {
            this.pollForm.patchValue({ imageUrl: res.url });
            this.createPoll();
          },
          error: (err) => {
            this.isUploading = false;
            this.snackBar.open('Failed to upload image', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.createPoll();
      }
    }
  }

  private createPoll() {
    this.pollService.createPoll(this.pollForm.value).subscribe({
      next: (poll) => {
        this.isUploading = false;
        this.snackBar.open('Poll created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/manage-polls']);
      },
      error: (err) => {
        this.isUploading = false;
        this.snackBar.open(err.error?.error || 'Failed to create poll', 'Close', { duration: 3000 });
      }
    });
  }
}
