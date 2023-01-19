const express = require('express');
const router = express.Router();
const { getAsync } = require('../redis/index');

router.get('/', async (req, res) => {
    const stats = await getAsync('added_todos') || 0
    res.send(({
        added_todos: Number(stats)
    }))
})

module.exports = router;