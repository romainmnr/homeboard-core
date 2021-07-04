/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { Server as WsServer } from 'socket.io'
import  { Server as HttpServer } from 'http'
import  { Server as HttpsServer } from 'https'
import { HomeboardCore } from './../HomeboardCore'
import { HBCO } from './../Objects/HBCO'
import { WebSocket } from './WebSocket'
import { HBOID } from '../Constants'


export declare interface SocketServer 
{
  on(event: string, listener: Function): this;

}

export class SocketServer extends HBCO
{
  hbInstance: HomeboardCore
  wsServer: WsServer
  clients: Array<WebSocket>


  constructor(hbInstance: HomeboardCore, httpServer: HttpServer | HttpsServer, options: Object)
  {
    super(HBOID.SOCKET_SERVER)
    this.hbInstance = hbInstance
    this.wsServer = new WsServer(httpServer, options)
    this.clients = []


    this.wsServer.on('connection', (socket) => {
      this.debug('New WebSocket connection')
      this.clients.push(new WebSocket(this.hbInstance, socket));
    })

  }


  close()
  {
    this.debug('Closing WebSocket server...')
    this.wsServer.close()
  }

}