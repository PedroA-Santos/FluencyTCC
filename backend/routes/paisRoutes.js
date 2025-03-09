const paisController = require('../controller/paisController');
const { Router } = require('express');

const router = Router();

router.get('/', paisController.listAll);

router.get('/:id', paisController.listById);

router.get('/nome/:nome', paisController.listByNome);

router.post('/', paisController.postPais);

router.put('/:id', paisController.putPais);

router.delete('/:id', paisController.deletePais);

module.exports = router;



