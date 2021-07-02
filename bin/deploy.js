const fetch = require('node-fetch')

const userInfo = require('../\.baker/\.userInfo.json')

const fs = require('fs')

const FormData = require('form-data')

const files = new FormData()

const {httpsAgent,host,final} = require('./config')

let formData = new FormData()

let domain_name = null

let count = 0

// check to see if your have activated hosting service

function isHostActive(){
	
	return new Promise(async (resolve,reject) => {
	
		try{
			
			//request options
			
			const opt = {
			
				headers:{'authorization':`token ${userInfo.token}`},
				
				
				
			}
			
			const response = await fetch(`${final.deployHost}/project/static_deploy/isActive?proj_pub_id=${userInfo.proj_pub_id}`,opt)
			
			
			if(response.status == 404) {
			
				reject({
				
					type:0,
					
					message:' you have not activated hosting service \n head onto our website and activate it https://baker.com'
				})
			}
			
		else if (response.status === 200) {
				
				const info = await response.json()
				
				console.log(` this is info ${JSON.stringify(info)}`)
				resolve(info)
			
			}
			
			else reject({type:1,message:'UNKNOWN ERROR'})
	
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
	
	
	console.log(dir)
	try{
	
		const result = await fs.promises.readdir(dir)
		
		count = count +1
		
		if(count == 1 && result.length < 1) throw 'empty folders cant be uploaded'
		
		result.forEach((x) => {
			
			upload(`${dir}/${x}`)
		
		})
		
		
	
	}catch(err) {
	
		
		//console.log(name)
		if(err.errno === -20){
			
			let name = dir.split('/')
			
			let stuff = name.splice(0,2)
		
			name = name.join('/')
			
			name = `${domain_name}/${name}`
			
			formData.append(name,fs.createReadStream(dir))
			
		}
	}	
}

//send files to server

const send  = async (pub_id) => {

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
		
		const response = await fetch(`${final.nfsApi}/nfsApi/upload?pub_id=${pub_id}`,opt)
		
		console.log(response.status)
		
		if(response.status === 200) {
		
			console.log(' deployment was successfull')
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
			
			console.log(userInfo)
			if('token' in userInfo && 'proj_pub_id' in userInfo) resolve(true)
			
			throw 'failed to deploy \n this error was caused because havent logined in or you havent initalized a project \n please read up on the steps required to deploy with swiftbase';
		
		}catch(err) {
			
			reject(err)
		
		}
	
	})


}

//
async function deploy(){

	try{
		
		await hasInit()
		
		const info = await isHostActive()
		
		domain_name = info.message.domain_name

		formData.append('domain_name',info.message.domain_name)
		
		upload('./out')
		
		setTimeout(() => {
			
			send(info.message.pub_id)
			
			console.log(formData)
			
		},3000)
	
		
		
	}
	catch(err) {
	
		console.log(err.message)
		
		return 0
	}

}

module.exports = deploy
