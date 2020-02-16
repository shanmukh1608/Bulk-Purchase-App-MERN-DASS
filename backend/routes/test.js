function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}
// router.post('/api/posts', verifyToken, (req, res) => {  
    
    router.route('/api').post(verifyToken, (req, res) => {  
        jwt.verify(req.token, 'secretkey', (err, authData) => {
          if(err) {
            res.sendStatus(402);
          } else {
            res.json({
              message: 'Post created...',
              authData
            });
          }
        });
      });
    