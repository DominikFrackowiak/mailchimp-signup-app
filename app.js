const express = require('express')
const mailchimp = require('@mailchimp/mailchimp_marketing')

const app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mailchimp.setConfig({
	apiKey: 'heregoesthekey', //add here your apiKey
	server: 'us21', //add here your server
})

app.use(express.static(__dirname + '/')) //in order to be able to link to locally stored files

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res) => {
	const { firstName, lastName, email } = req.body
	const listId = 'heregoesthelistid' // add here your list id

	const newMember = {
		email_address: email,
		status: 'subscribed',
		merge_fields: {
			FNAME: firstName,
			LNAME: lastName,
		},
	}

	const run = async () => {
		try {
			const response = await mailchimp.lists.addListMember(
				listId,
				JSON.stringify(newMember)
			)
			res.sendFile(__dirname + '/success.html')
		} catch (error) {
			const errData = JSON.parse(error.response.text)
			res.sendFile(__dirname + '/failure.html')
			console.log(errData)
		}
	}

	run()
})

app.post('/failure', (req, res) => {
	res.redirect('/')
})

app.listen(3000, () => {
	console.log('Server is running on port 3000.')
})
