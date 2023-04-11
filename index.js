/* Esta es la forma en que funciona el jwt:

1. El cliente envía un post con los datos del login.
2. El server genera un jwt con su clave secreta y le devuelve el token al cliente.
3. El cliente debe ahora enviar en cada request el token y el server validará en cada ruta que se trate del token válido. 
5. Si está ok el token, envía el response.

https://youtu.be/tWQobKFQLG0


*/

const express = require('express');
const jwt = require('jsonwebtoken');
const app= express();

app.use(express.json());

app.get('/', (req,res)=>{
  res.json({
    text: 'api works!'
  });
});

app.post('/api/login',(req,res) => {
  const user = {id: 3};   // esto simula un dato que vino del body
  const token = jwt.sign({user}, 'my_secret_key'); //esto generar un token
  res.json({
    token
  });
});


// en esta ruta, voy a ejectuar un middleware antes de la callback del req y res
app.get('/api/protected', ensureToken, (req,res)=> {
  jwt.verify(req.token, 'my_secret_key', (err, data)=>{
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        text: 'protected',
        data
      })
    }
  })
  });

function ensureToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    //obtener el hash
    // el bearerHeader viene con la palabra bearer y luego el hash, hay que separarlo
    const bearer = bearerHeader.split(" "); // esto divide el texto en dos a partir que encuentre un espacio en blanco y devuele un arreglo con dos valores (lo que tiene antes y después del espacio en blanco)
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, ()=> {
  console.log('Server on port 3000');
})
