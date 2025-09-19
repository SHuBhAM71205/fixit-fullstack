const express = require('express')
const app = express()
const cors = require('cors');
const conn =require('./db.js');

const mainttag=require('./models/Tag/TagMaintenance.js')
const areatag=require('./models/Tag/TagArea.js');
const roletag = require('./models/Tag/TagRole.js');
conn();
//use env vars
require('dotenv').config();
const port = process.env.PORT;



app.use(cors({
  origin:[process.env.FRONTEND_USER,process.env.FRONTEND_ADMIN,process.env.FRONTEND_TM], 
  exposedHeaders: ['Auth-Token']   
}));

app.use(express.json());

//endpoints
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/taskmaster', require('./routes/taskmaster'));
app.use('/api/admin', require('./routes/admin'));

// -----------------------------------------------------------

app.get('/api/gen/mainttag', async (req, res) => {
  try {
    const tags = await mainttag.find();
    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
      error: error.message
    });
  }
});

app.get('/api/gen/areatag', async (req, res) => {
  try {
    const tags = await areatag.find();
    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
      error: error.message
    });
  }
});

app.get('/api/gen/roletag', async (req, res) => {
  try {
    const tags = await roletag.find();
    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
      error: error.message
    });
  }
});
//start listen
app.listen(port, () => {
  console.log(`FIXIT app listening on port ${port}`)
})