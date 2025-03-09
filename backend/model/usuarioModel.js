const db = require("../db");

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })
}

exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);  // Retorna null se não encontrar
            resolve(results[0]);  // Retorna o primeiro usuário encontrado
        });
    });
};


//Busca o usuario a partir do email para realizar o login // AINDA NÃO ESTÁ FEITO NO CONTROLLER
exports.listByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};



//post
exports.post = ({ username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id }) => {
    console.log(username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id);

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil,data_nascimento,pais_origem_id) VALUES (?, ?, ?, ?, ?, ?, ?,?,?);',
            [username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}


//put
exports.put = ({ username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE usuarios SET username = ?, email = ?, senha = ?, idioma_nativo_id = ?, genero_id = ?, bio = ?, foto_perfil = ?,data_nascimento = ?, pais_origem_id = ? WHERE id = ?',
            [username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}


//delete
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM usuarios WHERE id = ?',
            [id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}




// ESSAS DUAS FUNÇÕES ABAIXO SÃO PARA O STEP 2 DO CADASTRO E PARA O STEP 1 TAMBÉM, VOU DEIXAR O POST NORMAL E O PUT SÓ PRA USAR NO POSTMAN SE PRECISAR




// ESSA DAQUI CADASTRA O USUARIO PRIMEIRO, OU SEJA, O EMAIL, SENHA, IDIOMA NATIVO E GENERO
exports.postStep1 = ({ email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios (email, senha, idioma_nativo_id, genero_id,data_nascimento,pais_origem_id) VALUES (?, ?, ?, ?,?,?);',
            [email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id], // Inserindo os dados aqui
            (err, results) => {
                if (err) return reject(err);

                // Aqui estamos pegando o `insertId` que é gerado após a inserção
                const id = results.insertId;

                // Resolva a promessa com o id e os outros dados
                resolve({ id, email, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id });
            }
        );
    });
};



// ESSA DAQUI É PARA O STEP 2 DO CADASTRO, OU SEJA, O NOME, BIO E FOTO DE PERFIL
exports.updateStep2 = ({ id, username, bio, foto_perfil }) => {
    return new Promise((resolve, reject) => {
        console.log("ID recebido no modelo:", id);  // Verificando se o id está sendo recebido corretamente no modelo

        // Verifique se o id está sendo passado corretamente
        if (!id) {
            return reject(new Error('ID não fornecido para atualização.'));
        }

        db.query(
            'UPDATE usuarios SET username = ?, bio = ?, foto_perfil = ? WHERE id = ?',
            [username, bio, foto_perfil, id], // Passando os valores para a query
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};




// Função para verificar se o idioma existe na tabela 'idiomas', utilizei no cadastro, se precisar pode usar também, mas não apague 
exports.listByIdIdioma = (idioma_nativo_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM idiomas WHERE id = ?;',
            [idioma_nativo_id], // Verificando se o idioma existe
            (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0); // Retorna true se o idioma existir, caso contrário, false
            }
        );
    });
};


