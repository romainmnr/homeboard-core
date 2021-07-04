/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { HomeboardCore, HomeboardCoreOptions } from './HomeboardCore'
import { ConfigFile } from './Modules/ConfigFile'

process.title = "homeboard-Core"
console.log('Starting Homeboard-Core...')


// Setup basic process handlers
process.on('exit', code => { 
  console.error(`Exiting Homeboard-Core with code: ${code}`)
})

process.on('SIGINT', () => { 
  if(homeboard) homeboard.destroy()
  process.exit(0);
})

process.on('uncaughtException', err => {
  console.error('FATAL ERROR in Homeboard-Core', err)
})
// --

// function runTest()
// {
//   const firstPage = homeboard.getPageByIndex(0)
//   if(firstPage){
//     const data = homeboard.computePage(firstPage.uid)
//     console.log('Result for page 0: ', data)
//   }

// }

const configFilePath = process.env.HB_CONFIG_FILE || './config.json'

let homeboard : HomeboardCore
// we use ConfigFile to load and watch the file modification to relaunch Homeboard
const configFile = new ConfigFile(configFilePath, { watch: true })

configFile.on('loaded', (json) => {
  // Destroy current instance if exist
  if(homeboard) homeboard.destroy()
  console.log('\n\r')
  // Start Homeboard instance
  homeboard = new HomeboardCore(json as HomeboardCoreOptions)

  // runTest()
})

// Load config file
configFile.load()
