# Movie_DB_User_Login
This project is based on building API's to ensure smooth user login ,API's where built following RESTful API priciples

# express
 -starting the server and listing for http requests
 -managing routes and handling requests
# mongoose
 mongoose.Schema - has been used to specific the schema of user Models
# jwt
 -jsonwebtoken are used for authenticating the user
 -on loging in the user is provided with a token 
 -the user is authenticated every time the user make a http request to the server using this token
 
# sign up functionality
 -New Users can signup by providing userinfo such as:
    -user name
    -email
    -role(default admin)
    -password
    -confirmPassword
-validator have been mentioned in user schema to validate weather:
    -valid email or not
    -password is long enough(8 char's)
    -password matchs with confirmPassword or not

# login functionality
-User can login using there email and password
-if credentials are valid user is provided with token 
-which can be used to authenticate the user for future requests

# protect  functionality
-this is used to protect the routes so that only the authenticated user is able to access the sensitive information
-token which is provided to user on login is verifies:
    -that the token is valid or not
    -that the user still exists in our DB or not
    -has there been any password updates after the  token has been issued or not
-if token is verified the user is allowed to access the info

# forgot password functionality
-user is found user the email address provided
-A reset token has been generated 
-this token has been updated in the user model 
-A mail is sent to user email along with the url to reset password and token to valid the reset password 

# reset password functionality
-find the user based in the reset token
-password updation
-saving the changes
-loging in the user and providing the token(jwt)

# update Password functionality
-finding the user based on email
-validating the provided password with current password
-update the current with provided new_password :
    -validation is again performed to check weather new_password and new_confirmPassword are matching or not

# mongosantize
-used for data santization against NoSql injection

# xss
 -used for data santization against cross-site-scripting
