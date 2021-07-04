/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import Axios, { AxiosInstance } from 'axios'
import { HBCO } from './HBCO'
import { HBOID } from '../Constants'

export declare interface IotDevice 
{
  init(): this;
  on(event: 'updated', listener: (this: IotDevice) => void): this;

}

/**
 * Basic class for IOT Device
 */
export class IotDevice extends HBCO
{
  httpAgent: AxiosInstance

  constructor(typeId: HBOID, customId?: string)
  {
    super(typeId)
    if(customId) this.uid = customId
    this.httpAgent = Axios.create()

  }

}
