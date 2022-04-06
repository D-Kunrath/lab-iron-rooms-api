// pacotes
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User.model');

// executar router
const router = Router();
console.log('test')

router.post('/signup', async (req, res) => {
  // informações q quero receber
  const { username, password } = req.body;
  try {
    // verifico se as informações existem
    if (!username || !password) {
      throw new Error('Missing username or password');
    }

    // verifico se usuário já existe no banco
    const userFromDb = await User.findOne({username});
    if(userFromDb) {
      throw new Error('Username already exists');
    }

    // caso não exista o usuário no banco, sigo a cria-lo

    // criptografo a senha
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);

    // criar usuário no banco
    await User.create({
      username,
      passwordHash,
    })

    // se não houve erros até aqui
    res.status(201).json('User created!')
  } catch (error) {
    res.status(500).json({message: 'Error creating user', error: error.message})
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // verifico se informações existem
    if (!username || !password) {
      throw new Error('Missing information');
    }

    // verifico se usuário existe
    const userFromDb = await User.findOne({username});
    if (!userFromDb) {
      throw new Error('Wrong username or password');
    }

    // valido a senha
    const validation = bcrypt.compareSync(password, userFromDb.passwordHash);

    if(!validation) {
      throw new Error('Wrong username or password');
    }

    // crio informações para o token carregar
    const payload = {
      id: userFromDb._id,
      username: userFromDb.username
    };

    // crio o token que vai carregar a informação de login
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1day'
    });

    // se não houve erros até aqui
    res.status(200).json({user: payload, token});
  } catch (error) {
    res.status(500).json({message: 'Error trying to login', error: error.message});
  }
})


module.exports = router;