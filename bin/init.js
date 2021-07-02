
const fs = require('fs')
const fetch = require('node-fetch')
const userInfo = require('../\.baker/\.userInfo.json')
const {httpsAgent,host,final} = require('./config')

//check to see if user has logged in
//if a user has login in before a file containig the credentials will be found
// if not the user hasnt loggged in a will be asked to login


function checkIsAuth(){

	return new Promise((resolve,reject) =>{
		
		if('token' in userInfo) resolve(true)
		
		else reject({type:0,mssg:'not authneticated please login to use our services'})
	
	})

}
//check to see if project is real
//meaning if the project actually exists
function checkProject(){
		
	return new Promise(async(resolve,reject) => {
	
		try{
			
			console.log(userInfo)
			
			console.log(process.argv[3])
			
			const proj_name = process.argv[3];
			
			//request options
			
			const opt = {
			
				headers:{
				
					'authorization':`token ${userInfo.token}`
					
				},
				
				method:'POST',
				
				
			}
		
			const response = await fetch(`${final.projectHost}/project/checkProject?proj_name=${proj_name}`,opt)
			
			console.log(` this is me ${response.status}`)
			
			if(response.status == 200) {
			
				const result = await response.json()
				
				console.log(result)
				
				if('proj_pub_id' in userInfo) {
				
					userInfo.proj_pub_id = result.message.proj_pub_id
					
					console.log(`successfully initialized project \n please add your static files into the out directory \n `)
					
				}
				else {
				
					userInfo['proj_pub_id'] = result.message.proj_pub_id
					
					await fs.promises.writeFile('./\.baker/\.userInfo.json',JSON.stringify(userInfo))
					
									console.log(`successfully initialized project \n please add your static files into the out directory \n `)
				}
			}
			
			resolve(true)
			
		}
		
		catch(err) {
			
			console.log('here');
			
			console.error(err);
			 reject({
			 
			 	type:1,
			 	
			 	mssg:err.message
			 })
			
		}
	
	})		
	

}




//main init function 
async function init(){
	
	
	if(process.argv.length < 4) {
	
		console.log('argument is missing \n please pass the project name \n eg baker init facebook')
		
		return 0
	}
	
	else{
	
	
		return new Promise(async(resolve,reject) => {
		
			try{
			
				//check to see if users has required credentials
				
				await checkIsAuth()
			
				//check to see if project exists
				
				await checkProject()
				
		
				return 0	
			}
		
			catch(err) {
		
				console.log(err)
				
				if(err.type ==0) console.log(err.mssg)
				
				else if(err.type == 1 ) console.log(err.mssg)
					
			    else if (err.type == 2) console.log(err.mssg)
			    
			    else if (err.type == 3 ) console.log(err.mssg)
			    
				return 0
		
	
		
			}
		})
	
	}

}

module.exports = init
