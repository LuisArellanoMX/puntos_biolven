// Our Dependecies
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(cors());

// Let us run the server. So its running
app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

// Let us create our database (mysql)
const db = mysql.createConnection({
    user: 'ucrdccfiljupv2w1',
    host: 'buu6gpjatb8qojzzzdkp-mysql.services.clever-cloud.com',
    password: 'k9oD3LjZCZsXnaWMxyQS', //If you have set xampp password please enter it here
    database: 'buu6gpjatb8qojzzzdkp',
})

// let us now create a route to the server that will register a user

app.post('/asociado', (req, res) => {
    const sentEmail = req.body.Email
    const sentUserName = req.body.UserName
    const sentPassword = req.body.Password
    const sentCoded = req.body.Code
    const sentDatosBan = req.body.DatosBan
    const sentFacotor = req.body.Factor

   
    const SQL = 'INSERT INTO users (email, username, password, code, datos_bancarios, factor) VALUES (?,?,?,?,?,?)'
    const Values = [sentEmail, sentUserName, sentPassword, sentCoded, sentDatosBan, sentFacotor]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            console.log('Usuario insertado correctamente!');
            res.send({ message: 'Usuario insertado!' });
        }
    })
})


app.put('/asociado/:id', (req, res) => {
    const userId = req.params.id;
    const sentEmail = req.body.Email;
    const sentUserName = req.body.UserName;
    const sentPassword = req.body.Password;
    const sentCoded = req.body.Code;
    const sentDatosBan = req.body.DatosBan
    const sentFacotor = req.body.Factor

    // Sentencia SQL para actualizar un usuario
    const SQL = 'UPDATE users SET email = ?, username = ?, password = ?, code = ?, datos_bancarios = ?, factor = ? WHERE id = ?';
    const Values = [sentEmail, sentUserName, sentPassword, sentCoded, sentDatosBan, sentFacotor, userId];

    // Ejecutar la consulta
    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ message: 'Usuario no encontrado!' });
        } else {
            console.log(`Usuario con ID ${userId} actualizado correctamente!`);
            res.send({ message: `Usuario con ID ${userId} actualizado!` });
        }
    });
});

app.get('/asociado', (req, res) => {

    db.query('SELECT * FROM users',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

app.get('/asociado/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al obtener el registro');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Asociado no encontrado');
            return;
        }

        res.json(result[0]);
    });
});

// Ruta para eliminar un asociado por ID
app.delete('/asociado/:id', (req, res) => {
    const userId = req.params.id;

    // Sentencia SQL para eliminar un usuario
    const SQL = 'DELETE FROM users WHERE id = ?';

    // Ejecutar la consulta
    db.query(SQL, [userId], (err, results) => {
        if (err) {
            res.send(err);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ message: 'Usuario no encontrado!' });
        } else {
            console.log(`Usuario con ID ${userId} eliminado correctamente!`);
            res.send({ message: `Usuario con ID ${userId} eliminado!` });
        }
    });
});


app.get('/compras/:user', (req, res) => {
    const user = req.params.user;
    db.query('SELECT * FROM compras WHERE usuario = ?', [user],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

app.get('/compras_canje/:user', (req, res) => {
    const user = req.params.user;
    db.query('SELECT * FROM compras WHERE usuario = ? AND id_solicitud IS NULL', [user],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

app.get('/suma_compras/:user', (req, res) => {
    const user = req.params.user;
    db.query('SELECT SUM(puntos_compra) AS suma_puntos FROM compras WHERE usuario = ? AND estado_compra = 1 AND id_solicitud is NULL', [user],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

app.put('/compras/:id', (req, res) => {
    const id_compra = req.params.id;
    const id_solicitud = req.body.id_solicitud

    // Sentencia SQL para actualizar un usuario
    const SQL = 'UPDATE compras SET id_solicitud = ? WHERE id_compra = ?';
    const Values = [id_solicitud, id_compra];
    console.log("valor de id_solicitud: "+id_solicitud)
    // Ejecutar la consulta
    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ message: 'Compra no encontrado!' });
        } else {
            console.log(`Compra con ID ${id_compra} actualizado correctamente!`);
            res.send({ message: `Compra con ID ${id_compra} actualizado!` });
        }
    });
});

app.post('/crear_solicitud/:user', (req, res) => {
    const sentUsuario = req.body.Usuario
    const sentPuntos = req.body.Puntos

    // Lets create SQL statement to insert the user to the Database table Users
    const SQL = 'INSERT INTO solicitudes (usuario, puntos_solicitud) VALUES (?,?)'
    const Values = [sentUsuario, sentPuntos]

    // Query to execute the sql statement stated above
    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            const newSolicitudId = results.insertId;
            console.log('Solicitud creada correctamente con ID:', newSolicitudId);

            console.log('Solicitud creada correctamente!');
            res.send({ message: 'Solicitud creada!', id_inserted: newSolicitudId });
        }
    })
})

app.get('/solicitud/:user', (req, res) => {
    const user = req.params.user;
    if(user == 'admin'){
        db.query('SELECT * FROM solicitudes',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    }else{
        db.query('SELECT * FROM solicitudes WHERE usuario = ?', [user],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    }
})

app.get('/solicitud_detalle/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM solicitudes JOIN users on solicitudes.usuario = users.username WHERE id_solicitud = ?',[id],
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})


app.post('/login', (req, res) => {
    const sentloginUserName = req.body.LoginUserName
    const sentLoginPassword = req.body.LoginPassword

    // Lets create SQL statement to insert the user to the Database table Users
    const SQL = 'SELECT * FROM users WHERE username = ? && password = ?'
    const Values = [sentloginUserName, sentLoginPassword]

    // Query to execute the sql statement stated above
    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send({ error: err })
        }
        if (results.length > 0) {
            res.send(results)
        }
        else {
            res.send({ message: `Credentials Don't match!` })
        }
    })
})

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de multer para guardar archivos en una carpeta local
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

  // Endpoint para manejar la carga de la imagen
app.post('/upload', upload.single('image'), (req, res) => {
    //const img = fs.readFileSync(req.file.path);
    const filePath = req.file.filename;
    //const encodedImg = img.toString('base64');
    const id_solicitud = req.body.id_solicitud;
    const comentario = req.body.comentario;
    console.log(filePath)
  
 
  
    const sql = 'UPDATE solicitudes SET imagen = ?, comentario_respuesta=?,estado_solicitud=1 WHERE id_solicitud=?';
    db.query(sql, [filePath,comentario,id_solicitud], (err, result) => {
      if (err) throw err;
      res.send('File uploaded and saved to database');
    });
  });