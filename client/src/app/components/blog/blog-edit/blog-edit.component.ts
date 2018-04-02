import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../service/blog.service';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  blog;
  currentUrl;
  loading = true;

  constructor(private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private blogService: BlogService) { }

  updateBlogSubmit() {
    this.processing = true;
    this.blogService.updateBlog(this.blog).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000)
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = 'blog not found';
      } else {
        this.blog = data.blog;
        this.loading = false;
      }
    })
  }

}
