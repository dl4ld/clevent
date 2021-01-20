const cmdArgs = require('command-line-args')
const secureAmqp = require('../cllibsecureamqp')

const cmdOptions = [
	{ name: 'send', alias: 's', type: String},
	{ name: 'config', alias: 'c', type: String}
]
const options = cmdArgs(cmdOptions)
options.config = options.config || "./config"
const config = require(options.config)
const toAddress = options.send
let domainToken = null

async function main() {
	await secureAmqp.init(config)
	const myAddress = secureAmqp.getMyAddress()
	console.log("Actor address: ", myAddress)
	console.log("Actor keys: ", secureAmqp.keys())

	// Sign my Id by domain
	secureAmqp.callFunction(config.domain, ".f.signActorId", secureAmqp.id, null, function(res) {
		const token = res.msg
		const verify = secureAmqp.verifyToken(token)
		const decoded = secureAmqp.decodeToken(res.msg)
		if(verify) {
			console.log("Received domain token: ", token)
			domainToken = token
			
			secureAmqp.emitEvent("codeRed", "boolean", "true", token)
			//secureAmqp.emitEvent("codeOrange", "boolean", "true", token)
			//secureAmqp.emitEvent("codeYellow", "boolean", "true", token)

		}
	})
}


main()


