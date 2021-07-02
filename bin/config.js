const https = require('https')

module.exports = {
	
	httpsAgent: new https.Agent({

		rejectUnauthorized:false
	
	}),
	
	host:'baker.com',
	
	final:{
	
		accountHost:'http://localhost:5000',
		
		projectHost:'http://localhost:4000',
		
		deployHost:'http://localhost:3000',
		
		nfsApi:'http://localhost:2000'
		
	},
	

}
