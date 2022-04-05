const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authorization = req.get('Authorization');
  try {
    if(!authorization) {
      throw new Error('Missing authorization token')
    }
    
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ... decodedToken };

    // se não houve erros até aqui, segue para a proxima rota
    next();
  } catch (error) {
    res.status(401).json({message: 'Unauthorized', error: error.message});
  }
};

module.exports = auth;