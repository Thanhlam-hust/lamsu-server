const express = require('express');

const router = express.Router();

const tableController = require('./table.controller');

const { verifyToken } = require('../../middleware/auth.middleware');


router.get(
    '/',
    verifyToken,
    tableController.getTables
);


router.post(
    '/',
    verifyToken,
    tableController.createTable
);


router.put(
    '/:id',
    verifyToken,
    tableController.updateTable
);


module.exports = router;