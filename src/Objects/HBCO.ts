/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
/**
* Basic class for Homeboard Core Object
*/
import Debug from 'debug'
import chalk from 'chalk'
import EventEmitter from 'events'
import { nanoid } from 'nanoid'
import { HBOID } from './../Constants'

const HB_DEBUG_NS = 'homeboard-core'


export class HBCO extends EventEmitter
{
  readonly oid: HBOID;
  uid: string
  private __debug: Function
  
  constructor(objectId: HBOID)
  {
    super()
    this.oid = objectId
    this.uid = nanoid(10)
    this.__debug = Debug(`${HB_DEBUG_NS}/${this.oid}`)
    this.debug(`Creating new ${objectId} object`)
  }

  brief()
  {
    return {
      oid: this.oid,
      uid: this.uid
    }
  }


  debug(...args: any[])
  {
    this.__debug(`[${chalk.blue('DEBUG')}][${chalk.gray(this.uid)}]`, ...args)
  }
  error(...args: any[]) 
  {
    this.__debug(`[${chalk.red('ERROR')}][${chalk.gray(this.uid)}]`, ...args)
  }
  warning(...args: any[]) 
  {
    this.__debug(`[${chalk.bold('WARN')}][${chalk.gray(this.uid)}]`, ...args)
  }


  static from(o: Object)
  {
    void(o)
    throw new Error('Method should be overwrite');
  }
  
}
