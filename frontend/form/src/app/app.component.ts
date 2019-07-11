import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpService } from './services/http.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private service: HttpService) { }

  title = 'form';
  modelForm: FormGroup;
  response: any = '';

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', [Validators.required, Validators.minLength(3)]],
      id: ''
    });

    this.modelForm.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.onControlValueChanged();
    })

    this.onControlValueChanged();
  }

  formErrors = {
    name: '',
    role: ''
  }

  private validationMessages = {
    name: {
      required: 'some validation in future'
    },
    role: {
      required: 'some validation in future',
      minlength: 'some validation in future'
    }
  }

  onSubmit(form): void {
    console.log(form.value);
  }

  onControlValueChanged() {
    const form = this.modelForm;

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const validationMessages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += validationMessages[key] + ' ';
        }
      }

    }
  }

  cleanForm(){
    this.modelForm.controls['id'].setValue('');
    this.modelForm.controls['name'].setValue('');
    this.modelForm.controls['role'].setValue('');
  }

  get() {
    this.service.getAll().subscribe(r => {
      this.response = JSON.stringify(r);
      this.cleanForm();
    }, (err: HttpErrorResponse) => {
      this.response = err.error;
      this.cleanForm();
    });
  }

  getById(form) {
    this.service.getById(form).subscribe(r => {
      this.response = JSON.stringify(r);
      this.cleanForm();
    }, (err: HttpErrorResponse) => {
      this.response = err.error
      this.cleanForm();
    });
  }

  postEmployee(form) {
    const e = ({
      name: form.value.name,
      role: form.value.role
    })
    this.service.postEmployee(e).subscribe(r => {
      this.response = JSON.stringify(r);
      this.cleanForm();
    }, (err: HttpErrorResponse) => {
      this.response = err.error
      this.cleanForm();
      });
  }

  putEmployee(form) {
    const e = ({
      id: form.value.id,
      name: form.value.name,
      role: form.value.role
    })
    this.service.putEmployee(e).subscribe(r => {
      this.response = JSON.stringify(r);
      this.cleanForm();
    }, (err: HttpErrorResponse) => {
      this.response = err.error
      this.cleanForm();
    });
  }

  deleteEmployee(form) {
    this.service.deleteEmployee(form.value.id).subscribe(r => {
      this.response = JSON.stringify(r);
      this.cleanForm();
    }, (err: HttpErrorResponse) => {
      this.response = err.error
      this.cleanForm();
    });
  }

}
