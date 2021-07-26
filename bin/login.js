const fetch = require('node-fetch')
const fs = require('fs')
const {httpsAgent,host,final,depl} = require('./config')

async function login(){	
		
		try{
	
			if(process.argv.length < 5) {

				console.log('please enter the required arguments')
				
				return 0
		
			}
			
			//request options
			
			const opt = {
			
				headers:{'content-type':'application/json'},
				
				method:'POST',
				
				body:JSON.stringify({
				
					email:process.argv[3],
					
					password:process.argv[4]
					
				}),
				
				
			}
			const response = await fetch(`${depl}/api/account/login`,opt)
			
			
			
			
			if(response.status == 200){
				
				const {message:token} = await response.json()
				
				console.log(token)
				await createBakerFolder()
				
				await fs.promises.writeFile('./\.baker/\.userInfo.json',JSON.stringify({token}))
				
				
				console.log('loggin succesfully \n run baker init to start \n this command take the projects names as argument ')
				
				return 0
			}
			else if (response.status == 401 ) {
			
				console.log('not a user')
				
				return 0
				
			}
			else {
			
				console.log('server is down')
				
				return 0
			}
			
		
	
		}catch(err) {
			
			console.log(err.message)
			
			return 0
			
			
		}
	
	
	
	

}

//

function createBakerFolder() {
	
	return new Promise(async (resolve,reject) => {
	
		try{
						
			await fs.promises.mkdir('./\.baker')
	
		}catch(err) {
			
			if(/EEXIST/.test(err.message)){
			
				resolve(true)
			}
			reject(err)
	
		}
	
	})
							
						
}

module.exports = login
