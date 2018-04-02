const User = require('../models/users'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        // Check if blog title was provided
        if (!req.body.title) {
          res.json({ success: false, message: 'Blog title is required.' }); // Return error message
        } else {
          // Check if blog body was provided
          if (!req.body.body) {
            res.json({ success: false, message: 'Blog body is required.' }); // Return error message
          } else {
            // Check if blog's creator was provided
            if (!req.body.createdBy) {
              res.json({ success: false, message: 'Blog creator is required.' }); // Return error
            } else {
              // Create the blog object for insertion into database
              const blog = new Blog({
                title: req.body.title, // Title field
                body: req.body.body, // Body field
                createdBy: req.body.createdBy // CreatedBy field
              });
              // Save blog into database
              blog.save((err) => {
                // Check if error
                if (err) {
                  // Check if error is a validation error
                  if (err.errors) {
                    // Check if validation error is in the title field
                    if (err.errors.title) {
                      res.json({ success: false, message: err.errors.title.message }); // Return error message
                    } else {
                      // Check if validation error is in the body field
                      if (err.errors.body) {
                        res.json({ success: false, message: err.errors.body.message }); // Return error message
                      } else {
                        res.json({ success: false, message: err }); // Return general error message
                      }
                    }
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                } else {
                  res.json({ success: true, message: 'Blog saved!' }); // Return success message
                }
              });
            }
          }
        }
      });

      router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
          if(err){
            res.json({success: false, message: err});
          } else {
            if(!blogs){
              res.json({ success: false, message: 'No blogs found'});
            }
            res.json({ success: true, blogs: blogs});
          }
        }).sort({'_id': -1});
      });

      router.get('/singleBlog/:id', (req, res) => {
        if(!req.params.id) {
          res.json({ success: false, message: 'No blog id provided'});
        } else {
          Blog.findOne({ _id: req.params.id}, (err, blog) => {
            if(err){
              res.json({ success: false, message: err})
            } else {
              if(!blog){
                res.json({ success: false, message: 'No blog found'});
              } else {
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  if(err){
                    res.json({ success: false, message: err });
                  } else{
                    if (!user){
                      res.json({ success: false, message: 'Could not authenticate user'});
                    } else {
                      if(user.username !== blog.createdBy){
                        res.json({ success: false, message: 'You are not authorised to edit'});
                      } else {
                        res.json({ success: true, blog: blog});
                      }
                    }
                  }
                })
              }
            }
          });
        }
      });

      router.put('/updateBlog', (req, res) => {
        console.log(req.body._id);
        if(!req.body._id){
          res.json({ success: false, message: 'No blog id provided'});
        } else {
          Blog.findOne({_id: req.body._id}, (err, blog) => {
            if(err){
              res.json({ success: false, message: 'No valid blog id provided'});
            } else {
              if(!blog){
                res.json({ success: false, message: 'No blog found'});
              } else {
                User.findOne({ _id: req.decoded.userId}, (err, user) => {
                  if(err){
                    res.json({ success: false, message: err});
                  } else {
                    if(!user){
                      res.json({ success: false, message: 'Not a valid user.'});
                    } else {
                      if(user.username !== blog.createdBy){
                        res.json({ success: false, message: 'You are not authorised to edit this blog post.'});
                      } else {
                        blog.title = req.body.title;
                        blog.body = req.body.body;
                        blog.save((err) => {
                          if(err){
                            if(err.errors){
                              res.json({ success: false, message: 'Please ensure the form ins filled correctly'});
                            } else {
                              res.json({ success: false, message: err});
                            }
                          }  else {
                            res.json({ success: true, message: 'Blog updated'});
                          }
                        });
                      }
                    } 
                  }
                })
              }
            }
          });
        }
      });
      
    return router;
}