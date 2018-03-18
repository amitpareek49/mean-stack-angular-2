const User = require('../models/users');

module.exports = (router) => {

	router.post('/register', (req, res) => {
		// Check if email was provided
		if (!req.body.email) {
		  res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
		} else {
		  // Check if username was provided
		  if (!req.body.username) {
			res.json({ success: false, message: 'You must provide a username' }); // Return error
		  } else {
			// Check if password was provided
			if (!req.body.password) {
			  res.json({ success: false, message: 'You must provide a password' }); // Return error
			} else {
			  // Create new user object and apply user input
			  let user = new User({
					email: req.body.email.toLowerCase(),
					username: req.body.username.toLowerCase(),
					password: req.body.password
			  });
			  // Save user to database
			  user.save((err) => {
				// Check if error occured
				if (err) {
				  // Check if error is an error indicating duplicate account
				  if (err.code === 11000) {
					res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
				  } else {
					// Check if error is a validation rror
					if (err.errors) {
					  // Check if validation error is in the email field
					  if (err.errors.email) {
						res.json({ success: false, message: err.errors.email.message }); // Return error
					  } else {
						// Check if validation error is in the username field
						if (err.errors.username) {
						  res.json({ success: false, message: err.errors.username.message }); // Return error
						} else {
						  // Check if validation error is in the password field
						  if (err.errors.password) {
							res.json({ success: false, message: err.errors.password.message }); // Return error
						  } else {
							res.json({ success: false, message: err }); // Return any other error not already covered
						  }
						}
					  }
					} else {
					  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
					}
				  }
				} else {
				  res.json({ success: true, message: 'Acount registered!' }); // Return success
				}
			  });
			}
		  }
		}
		});
		
		router.get('/checkusername/:username', (req, res) => {
			console.log(req.params.username);
			if(!req.params.username) {
				res.json({success: false, message: 'No username provided'});
			} else {
				User.findOne( {username: req.params.username } , (err, user) => {
					console.log(user);
					if(err){
						res.json({success: false, message: err})
					} else {
						if(user) {
							res.json({success: false, message: 'Username already taken'});
						} else {
							res.json({ success: true, message: 'Valid username'});
						}
					}
				})
			}
		});

		router.get('/checkemail/:email', (req, res) => {
			if(!req.params.email) {
				res.json({success: false, message: 'No email provided'});
			} else {
				User.findOne( {email: req.params.email } , (err, user) => {
					if(err){
						res.json({success: false, message: err})
					} else {
						if(user) {
							res.json({success: false, message: 'E-mail already taken'});
						} else {
							res.json({ success: true, message: 'Valid Email'});
						}
					}
				});
			}
		});


	return router;
} 