const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./restaurant')
mongoose.connect('mongodb+srv://apiuser:abcd1234@cluster0.agh0w.mongodb.net/rest-api?retryWrites=true&w=majority')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

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

app.use('/api',router);

app.listen(port);

console.log("Magic happens in port "+port)