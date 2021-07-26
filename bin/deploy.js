const fetch = require('node-fetch')

const userInfo = require('../\.baker/\.userInfo.json')

const fs = require('fs')

const FormData = require('form-data')

const files = new FormData()

const {httpsAgent,host,final,depl} = require('./config')

let formData = new FormData()

let domain_name = null

let count = 0


// check to see if your have activated hosting service

function isHostActive(){
	
	return new Promise(async (resolve,reject) => {
	
		try{
			
			const opt = {
			
				headers:{'authorization':`token ${userInfo.token}`},
				
				
				
			}
			
			const response = await fetch(`${depl}/api/project/service/frontend/isActive?proj_pub_id=${userInfo.proj_pub_id}`,opt)
			
			
			if(response.status == 404) {
			
				reject({
				
					type:0,
					
					message:' you have not activated hosting service \n head onto our website and activate it https://swiftbase.com'
				})
			}
			
		else if (response.status === 200) {
				
				const info = await response.json()
				
				console.log(` [isHostActive] ${JSON.stringify(info)}`)
				
				resolve(info)
			
			}
			
			else {
				const mssg = await response.json();
					
				reject({type:1,message:mssg});
				
			}
	
		}
		catch(err) {
			
			reject(err)
		}
	
	})

}

//check if  domain name has been set
/*
const checkDomainName = () => {

	let domain_name = null
	
	return new Promise(async(resolve,reject) =>{
	
		try{
			
			const opt = {
				
				headers:{'authorization':`token ${userInfo.token}`},
					
				agent:httpsAgent
					
			}
			
			const response = await fetch(`https://${host}/api/projects/host/hasName?proj_pub_id=${userInfo.proj_pub_id}`,opt)
				
			if(response.status == 200) {
			
				domain_name = await response.json()
				
				if(domain_name === null) {
				
					reject({message:' you will need to set a domain name to deploy \n head over to our website to set up your domain name https://baker.com'})
				}
			}
			
			resolve(domain_name)
		
		}
		catch(err) {
			
			reject(err)
		
		}
	
	})
}


*/

const upload = async(dir) => {
	
	//here
	console.log(dir)
	try{
	
		const result = await fs.promises.readdir(dir)
		
		count = count +1
		
		if(count == 1 && result.length < 1) throw {
			
			errno: 1,
			
			message: 'empty folders cant be uploaded'
			
		}
		
		result.forEach((x) => {
			if(x != 'node_modules') {
			
				upload(`${dir}/${x}`)
			
			}
			else console.log('node module')
		
		})
		
		
	
	}catch(err) {
	
		
		//not a directory
		if(err.errno === -20){
			
			let name = dir.split('/')
			
			let unneed = name.splice(0,2)
		
			name = name.join('/')
			
			name = `${domain_name}/${name}`
			
			formData.append(name,fs.createReadStream(dir))
			
		}
	}	
}

//send files to server

const send  = async (proj_pub_id,dn,type) => {

	console.log('here')
	try{
		
		//request option
		
		const opt = {
		
			headers:{
			
				'authorization' : `token ${userInfo.token}`
				
			},
			method:'POST',
			
			body:formData,
			
		
		
		}
		
		//making api call 
		console.log(opt)
		const response = await fetch(`${final.deployHost}/api/deploy/upload?proj_pub_id=${proj_pub_id}&dn=${dn}&type=${type}`,opt)
		
		console.log(response.status)
		
		if(response.status === 200) {
		
			console.log(' deployment was successfull');
		}
		else if (response.status === 404) {
		
			console.log('service not available right now\n please try again later.');
		}
		else{
			const mssg = await response.json();
			
			 console.log(mssg.message);
			
		}
	}
	catch(err) {
		
		console.error(err);
		throw err
	}

}

//check to see if project has been initialized before deployment


function hasInit(){
	
	return new Promise(async(resolve,reject) => {
	
		try{
			
			
			if('token' in userInfo && 'proj_pub_id' in userInfo) resolve(true)
			
			throw {
				
				message:'failed to deploy \n this error was caused because havent logined in or you havent initalized a project \n please read up on the steps required to deploy with swiftbase'
			
			}
		
		}catch(err) {
			
			reject({message: err.message})
		
		}
	
	})


}

//
async function deploy(){

	try{
		
		const {type,project_dir} = require('../swiftbase.config.js')
		
		await hasInit()
		
		const info = await isHostActive()
		
		
		domain_name = info.message[0].dn
		

		formData.append('domain_name',info.message[0].dn)
		
		upload(project_dir)
		
		setTimeout(() => {
			
			send(info.message[0].proj_pub_id,info.message[0].dn,type)
			
			console.log(formData)
			
		},3000)
		
		console.log(info)
	
		
		
	}
	catch(err) {
	
		console.log(err.message)

		console.log('here')
		
		return 0
	}

}

module.exports = deploy
