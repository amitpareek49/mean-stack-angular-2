import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../service/blog.service';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  message;
  messageClass;
  currentUrl;
  loading = true;
  processing = false;
  blog;
  foundBlog = false;

  constructor(private location: Location ,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router) { }

  deleteBlog() {
    this.processing = false;

    this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-danger';
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
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.blog = {
          title: data.blog.title, // Set title
          body: data.blog.body, // Set body
          createdBy: data.blog.createdBy, // Set created_by field
          createdAt: data.blog.createdAt // Set created_at field
        }
        this.foundBlog = true; // Displaly blog window
      }
    })
  }

}
