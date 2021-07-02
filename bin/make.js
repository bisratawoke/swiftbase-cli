#! /usr/bin/env node

const fs = require('fs');


/*(() => {

	console.log('we are making it!!')
})()
*/
(async() => {
	
	try{
		
		console.log('make me bitch')
		
		await fs.promises.mkdir('./\.baker')
		
		await fs.promises.mkdir('./out')
		
		await fs.promises.writeFile('./\.baker/\.userInfo.json',JSON.stringify({}))
		
	}catch(err){
	
		console.log(err.message)
	}

})();


