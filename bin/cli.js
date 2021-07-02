#! /usr/bin/env node

const init = require('./init.js')

const login = require('./login.js')

const deploy = require('./deploy.js')

const https = require('https')

// 

if(process.argv[2] == 'init'){
	
	init()
	
}

else if (process.argv[2] == 'deploy'){

	deploy()
}

else if(process.argv[2] == 'login'){

	login()
		
}
else {

	console.log('missing argument')

}



