const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '/$planner$/'
const fetchUser = require('../middleware/fetchUser')

//Route 1: Create a user using POST :"/api/auth/createuser".Doesn't require auth 
router.post('/createuser', [body('name', 'enter a valid name').isLength({ min: 3 }),
body('email', 'enter a valid email').isEmail(),
body('password', 'password must be atleast 5 character').isLength({ min: 5 })], async (req, res) => {
    let success = false
    //if there are errors return bad request and the errors 
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success, error: error.array() });
    }
    try {
        //checking whether the user exists or not 

        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ success, error: 'user with this email already exists' })
        }
        //creating a new user after findin none in db
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id,
                name: req.body.name,
            email: req.body.email
            }
        }
        const token = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, token })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Some error occured')
    }
})

// Route 2: authenticate a user using  POST "/api/auth/login" No login required
router.post('/login', [body('email', 'enter a valid email').isEmail(),
body('password', 'password must not be empty').notEmpty()],
    async (req, res) => {
        let success = false
        //if there are errors return bad request and the errors 
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { email, password } = req.body
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ success, error: 'enter correct credentials' })
            }
            const passwordcompare = await bcrypt.compare(password, user.password)
            if (!passwordcompare) {
                return res.status(400).json({ success, error: 'enter correct credentials' })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, JWT_SECRET);
            success = true
            res.json({ success, token })


        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error')
        }

    })

// Route 3:Get logged in user details using: POST "/api/auth/getuser" Login required 
router.post('/getuser', fetchUser, [body('email', 'enter a valid email').isEmail(),
body('password', 'password must not be empty').notEmpty()],
    async (req, res) => {
        try {
            const userid = req.user.id
            const user = await User.findById(userid).select(['-password', '-date'])
            console.log(user)
            res.send(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error')
        }
    })


module.exports = router