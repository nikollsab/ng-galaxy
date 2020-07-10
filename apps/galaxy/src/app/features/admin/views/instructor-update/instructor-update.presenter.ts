import { Injectable } from '@angular/core';
import { Instructor, InstructorResponse } from '../../models/instructor.model';
import { GlxLoadingComponent } from '@galaxy/commons/components';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { InstructorsHttp } from '../../commons/http/instructors.http';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable()
export class InstructorUpdatePresenter {

  instructors: Instructor[] = [];
  instructorId: string;

  constructor(
    private instructorsHttp: InstructorsHttp,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  initial() {
    this.instructorId = this.route.snapshot.paramMap.get('id');

    const loading = this.dialog.open(GlxLoadingComponent, { disableClose: true });

    forkJoin({
      instructores: this.instructorsHttp.getAll()
    })
    .pipe(finalize(() => loading.close()))
    .subscribe(
      ({ instructores }) => {
        this.instructors = instructores;
        },
      (err) => {
        console.log(err);
      }
    );
  }


  updateInstructor(body: Instructor) {
    const loading = this.dialog.open(GlxLoadingComponent, { disableClose: true });
    this.instructorsHttp.update(this.instructorId, body)
    .pipe(finalize(() => loading.close()))
    .subscribe(_ => this.goInstructors());
  }


  goInstructors() {
    this.router.navigateByUrl('/administrador/instructores');
  }
}
