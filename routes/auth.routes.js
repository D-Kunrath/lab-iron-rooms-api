// pacotes
const { Router } = require('express');
const bcrypt = require('bcryptjs');

// models
const User = require('../models/User.model');

// executar router
const router = Router();

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




module.exports = router;