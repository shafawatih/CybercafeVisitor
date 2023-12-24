const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cybercafe Visitor Management System API',
      description: 'API for managing visitors in a cybercafe',
      version: '1.0.0',
    },
  },
  apis: ['./Cybercafe.js'], //files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//connect to mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://myAtlasDBUser:h0Sp5O2iP0bJDJ4y@myatlasclusteredu.btn6xaa.mongodb.net/";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.use(express.json());
    app.listen(port, () => {
      console.log('Server listening at http://localhost:${port}');
    });
    

//admin login configuration
    app.post('/login/admin', async (req, res) => {
      try{
        const result =  await login(req.body.username, req.body.password)
        if (result.message === 'Correct password') {
          const token = generateToken({ username: req.body.username });
          res.send({ message: 'Successful login', token });
        } else {
          res.send('Login unsuccessful');
        }
      }catch(error){
            console.error(error);
            res.status(500).send("Internal Server Error");
        };
    });
    

    //create user
    app.post('/create/user', async (req, res) => {
      let result = createuser(
      req.body.username,
      req.body.idproof
      ); 
      res.send(result);
  });

    //see created user
    app.get('/view/user/admin', verifyToken, async (req, res) => {
      try {
      const result = await client
          .db('Cybercafe')
          .collection('Admin')
          .find()
          .toArray();
    
      res.send(result);
      } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      }
  });

    
    //create visitor
    app.post('/create/visitor', async (req, res) => {
      try {
        let result = await createvisitor(
          req.body.visitorname,
          req.body.idproof,
          req.body.entrytime
          ); 
          res.send(result);
      }
      catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        }
    });
    
    //see created visitor
    app.get('/view/visitor/admin', verifyToken, async (req, res) => {
        try {
        const result = await client
            .db('Cybercafe')
            .collection('Visitor')
            .find()
            .toArray();
    
        res.send(result);
        } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        }
    });
    

    //delete visitor
    app.delete('/delete/visitor/:idproof', verifyToken, async (req, res) => {
      const idproof = req.params.idproof;
    
      try {
        const deletevisitorResult = await client
          .db('Cybercafe')
          .collection('Visitor')
          .deleteOne({ idproof: idproof});
    
        if (deletevisitorResult.deletedCount === 0) {
          return res.status(404).send('Visitor not found or unauthorized');
        }
    
        res.send('Visitor deleted successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    
    //create visitor log
    app.post('/create/visitorlog/admin', verifyToken, async (req, res) => {
        let result = createvisitorlog(
        req.body.visitorname,
        req.body.idproof,
        req.body.timespend,
        req.body.payment
        ); 
        res.send(result);
    });
    

    //see created visitor log
    app.get('/view/visitorlog/admin', verifyToken, async (req, res) => {
        try {
        const result = await client
            .db('Cybercafe')
            .collection('Visitor Log')
            .find()
            .toArray();
    
        res.send(result);
        } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        }
    });

    //create computer
    app.post('/create/computer', async (req, res) => {
      let result = createcomputer(
        req.body.idproof,
        req.body.lanportno,
        req.body.available
        ); 
        res.send(result);
      });
      

    //see created computer  
    app.get('/view/computer/admin', verifyToken, async (req, res) => {
      try {
        const result = await client
        .db('Cybercafe').collection('Computer').find().toArray();
        
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    
        
  }catch (e) {
    console.error(e);

  }  
  finally {
    // Ensures that the client will close when you finish/error
    
  }
}

run().catch(console.dir);




//function 放下面

async function login(requsername, reqpassword) {
    let matchUser = await client.db('Cybercafe').collection('Admin').findOne({ username: { $eq: requsername } });
  
    if (!matchUser)
      return { message: "User not found!" };
  
    if (matchUser.password === reqpassword)
      return { message: "Correct password", user: matchUser };
    else
     return { message: "Invalid password" };
  }

//create user function
function createuser(requsername, reqidproof) {
  client.db('Cybercafe').collection('Admin').insertOne({
      "username": requsername,
      "idproof": reqidproof,
    });
    return "User is added";
  }
  
//create visitor function
function createvisitor(reqvisitorname, reqidproof, reqentrytime = 0) {
    client.db('Cybercafe').collection('Visitor').insertOne({
        "visitorname": reqvisitorname,
        "idproof": reqidproof,
        "entrytime":reqentrytime
      });
      return "Visitor is added";
    }

//create visitorlog function
function createvisitorlog(reqvisitorname, reqidproof, reqtimespend = 0, reqpayment = 0) {
    client.db('Cybercafe').collection('Visitor Log').insertOne({
        "visitorname": reqvisitorname,
        "idproof": reqidproof,
        "timespend": reqtimespend,
        "payment": reqpayment,
      });
      return "Visitor log is recorded";
    }

//create computer function
function createcomputer(reqidproof, reqLanportno, reqAvailable) {
  client.db('Cybercafe').collection('Computer').insertOne({

      "idproof": reqidproof,
      "lanportno": reqLanportno,
      "available": reqAvailable
    });
    return "Computer is added";
  }

  //token function
const jwt = require('jsonwebtoken');

function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'password',
    {expiresIn: 600}
  );

  console.log(token);
  return token;
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'password', function (err, decoded) {
    if (err) {
      res.status(401).send('Unauthorized');
      return;
    }
    req.admin = decoded;
    next();
  });
}