/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import fs from 'fs'
import { HBCO } from './../Objects/HBCO'
import { HBOID } from './../Constants'

import { Matrix } from './../Devices/Matrix'
import { UiPage, UiPageOptions } from './../Objects/UiPage'
import { UserProfile, UserProfileConfig } from './../Objects/UserProfile'
export interface ConfigFileOptions
{
  watch: Boolean
}

export declare interface ConfigFile 
{
  on(event: string, listener: Function): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'warning', listener: (error: Error) => void): this;
  on(event: 'loaded', listener: (config: Object) => void): this;

}

export class ConfigFile extends HBCO
{
 
  readonly filePath: string
  private _json: Object
  private _defConfig : Object = {
    "tls": false,
    "hostname": "localhost",
    "port": 3210,
    "routePrefix": null,
    "httpServerOptions" : {},
    "webSocketOptions": {},
    "devices": [],
    "pages": []

  }

  watch: Boolean

  constructor(filePath: string, option: ConfigFileOptions)
  {
    super(HBOID.CONFIG_FILE)
    this.filePath = filePath
    this._json = {}

    this.watch = option.watch || false

  }
  
  private readFile()
  {
    this.debug(`Reading config file at ${this.filePath}`)
    try {
      this._json = this.parseJson(fs.readFileSync(this.filePath))
      this.emit('loaded', this._json)
    } catch (error) {
      this.emit('error', error)
    }
  }

  private createDefault()
  {
    this.debug(`Creating default config file at ${this.filePath}`)
    fs.writeFileSync(this.filePath, JSON.stringify(this._defConfig, undefined, 2))
  }

  load()
  {
    if(!fs.existsSync(this.filePath))
    {
      this.warning('Configuration file not found')
      this.emit('warning', new Error(`Config file not found at ${this.filePath}`))
      this.createDefault()
      this.load()
    } else {

      this.readFile()
      if(this.watch)
      {
        this.debug(`Watching config file at ${this.filePath}...`)
        fs.watch(this.filePath, (eventType, filename) => {
          this.debug('File watcher:', eventType, filename)
          if(eventType === 'change') this.readFile()
        })
      }
    }
  }

  parseJson(buffer: Buffer)
  {
    const json = JSON.parse(buffer.toString())

    if(json.pages && Array.isArray(json.pages))
    {
      this.debug(`Found ${json.pages.length} page(s) in the config file.`)
      json.pages = json.pages.map((e: any) => UiPage.from(e as UiPageOptions))
    }
    if(json.userProfiles && Array.isArray(json.userProfiles))
    {
      this.debug(`Found ${json.userProfiles.length} user(s) in the config file.`)
      json.userProfiles = json.userProfiles.map((e: any) => new UserProfile(e as UserProfileConfig))
    }
    if(json.devices && Array.isArray(json.devices))
    {
      this.debug(`Found ${json.devices.length} device(s) in the config file.`)
      json.devices = json.devices.map((e: any) => this.parseObject(e))
    }
    return json
  }


  parseObject(data: any)
  {
    const oid = data && (data.oid as HBOID)
    switch (oid) {
      case HBOID.IOT_DEVICE_MATRIX : return new Matrix(data.uid, data.hostname)
      default: return undefined        
    }

  }

}