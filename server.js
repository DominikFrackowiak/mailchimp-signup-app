//AUDIENCE ID
//5577800d71

//API KEY
//55b5236d50d21d9c4cd61669492e65ec-us21

const https = require('https')
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/')) //in order to be able to link to locally stored files

app.use(express.json())

app.use(express.urlencoded())

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html')
})

app.get('/secret', (req, res) => {
	res.sendFile(__dirname + '/secret.html')
})

app.post('/', (req, res) => {
	const firstName = req.body.name
	const lastName = req.body.lastName
	const email = req.body.email

	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	}

	const jsonData = JSON.stringify(data)

	const url = 'https://us21.api.mailchimpo.com/3.0/lists/5577800d71'

	const options = {
		method: 'POST',
		headers: {
			Authorization: 'Dominik1: 55b5236d50d21d9c4cd61669492e65ec-us21',
		},
	}

	const request = https.request(url, options, response => {
		response.on('data', data => {
			console.log(JSON.parse(data))
		})
	})

	request.write(jsonData)
	request.end()
})

app.listen(3000, () => {
	console.log('D., your server is running at the port 3000')
})
