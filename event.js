const cmdArgs = require('command-line-args')

const cmdOptions = [
	{ name: 'config', alias: 'c', type: String},
	{ name: 'debug', type: Boolean}
]
const options = cmdArgs(cmdOptions)

const Actor = (options.debug) ?  require('../cllibsecureamqp').Actor : require('secureamqp').Actor

options.config = options.config || "./config"
const config = require(options.config)
let domainToken = null

async function main() {
	const actor = new Actor(config)
	await actor.boot()
	const myAddress = actor.id()
	console.log("Actor address: ", myAddress)
	actor.broadcast("codeRed", "boolean", "true")
}


main()


