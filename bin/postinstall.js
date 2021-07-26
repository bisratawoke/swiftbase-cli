#! /usr/bin/env node

const fs = require('fs');


(async() => {
	
	try{
		
		console.log('Post install hook running')
		
		await fs.promises.mkdir('./\.baker')
		
		await fs.promises.writeFile('./\.baker/\.userInfo.json',JSON.stringify({}))
		
		await fs.promises.mkdir('./out')
		
		
	}catch(err){
	
		console.log(err.message)
	}

})();


