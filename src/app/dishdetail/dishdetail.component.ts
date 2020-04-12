import { Component, OnInit,ViewChild , Inject} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { DISHES } from '../shared/dishes';
import { Comment} from '../shared/Comment';
import { trigger, state , animate , transition , style} from '@angular/animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  d = new Date();
  n = this.d.toISOString();
  dish: Dish;
  dishIds: string[];
  prev:string;
  next:string;
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  comment:Comment
  errMess: string;
  dishcopy: Dish;
  visibility='shown';



  formErrors={
    'name':'',
    'comment':''
  };

  validationMessages = {
    'name':{
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment':{
      'required':      'Comment is required.'
    }
  };


  constructor(private dishService: DishService, private location:Location, private route:ActivatedRoute,private fb: FormBuilder
    , @Inject('BaseURL') private BaseURL) {
    this.createForm();
   }

  ngOnInit() {
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds=dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => {this.visibility='hidden'; return this.dishService.getDish(params['id']);}))
    .subscribe(dish => {this.dish=dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown';},
    errmess => this.errMess= <any>errmess);
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)] ],
      comment: ['', Validators.required],
      rating: 5
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  setPrevNext(diishId:string){
    const index=this.dishIds.indexOf(diishId);
    this.prev=this.dishIds[(this.dishIds.length + index-1)%this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length + index+1)%this.dishIds.length];
  }
  goBack():void{
    this.location.back();
  }
  onSubmit() {
    this.comment= this.feedbackForm.value;
    this.comment.date= new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish= dish;
      this.dishcopy = dish;
    },
    errmes =>{this.dish = null; this.dishcopy = null; this.errMess = <any>errmes;});
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      name:'',
      comment:'',
      rating:5
    });
    this.feedbackFormDirective.resetForm();
  }
}
