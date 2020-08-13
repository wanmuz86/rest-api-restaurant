const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./restaurant')
const User = require('./user')
const auth = require('./auth')()
const jwt = require('jsonwebtoken');
const config = require('./config');
mongoose.connect('mongodb+srv://apiuser:abcd1234@cluster0.agh0w.mongodb.net/rest-api?retryWrites=true&w=majority')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(auth.initialize())

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', (req,res)=>{
	res.json({message:'hooray! welcome to our API!'});
})

router.post('/restaurants',(req,res)=>{
	let newRestaurant = new Restaurant({
		name:req.body.name,
		address:req.body.address,
		email:req.body.email,
		phone:req.body.phone,
		description:req.body.description,
		opening_time:req.body.opening_time,
		latitude:req.body.latitude,
		longitude:req.body.longitude,
		types:req.body.types

	})
	newRestaurant.save()
	.then(doc=>{
		res.json({message:'Create restaurant sucessfully'})
	}).catch(err=>{
		res.err({message:'Something is wrong'})
	})

})
router.get('/restaurants',(req,res)=>{
	Restaurant.find()
	.then(doc=>{
		res.json({data:doc})
	}).catch(err=>{
		res.err({message:'Something is wrong'})
	})

})
router.get('/restaurants/:id',(req,res)=>{
	Restaurant.findById(req.params.id)
	.then(doc=>{
		res.json({data:doc})
	}).catch(err=>{
		res.err({message:'Something is wrong'})
	})

})

router.put('/restaurants/:id',(req,res)=>{
	Restaurant.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify:false})
	.then(doc=>{
		res.json({message:'Restaurant updated sucessfully '})
	}).catch(err=>{
		res.err({message:'Something is wrong'})
	})

})

router.delete('/restaurants/:id', (req,res)=>{
	Restaurant.findOneAndRemove(req.params.id)
	.then(doc=>{
		res.json({message:'Restaurant succesfully deleted'})
	}).catch(err=>{
		res.err({messsage:'Something is wrong'})
	})

})

// This is Create
router.post('/register', (req,res)=>{
// Create
var newUser = new User({
	username:req.body.username,
	password:req.body.password
})
newUser.save().then(doc=>{

	res.json({message:'User succesfully registered!'})
}).catch(err=>{
	res.json({message:'An error occured '+err})
})
});

//This is Read- for login, we need to use POST because it is more secure
router.post('/login', (req,res)=>{

// Readd
User.findOne({username:req.body.username}).then(user=>{
	console.log(user)
	if (user){
	// if (req.body.password == user.password){
	// 	res.json({message:'Authenticated'});
	// }
	// else {
	// 	res.json({message:'Wrong password'})
	// }
	user.verifyPassword(req.body.password,function(err,isMatch){
		if (err) res.json({message:'Something is wrong'})
			if (!isMatch){
				res.json({message:'Wrong password'})
			}
			else {
				const token = jwt.sign(user.toJSON(), config.secret, {
					expiresIn: 10080
				});
				res.json({message:"success",token: 'JWT '+token})
			}
	})
}
else {
	res.json({message:'User not found!'})
}
}).catch(err=>{
	res.json({message:'An error occured '+err});
})
})



app.use('/api',router);

app.listen(port);

console.log("Magic happens in port "+port)