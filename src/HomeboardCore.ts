/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import path from 'path'
import { Server as HttpServer, createServer as createHttpServer } from 'http'
import { Server as HttpsServer, createServer as createHttpsServer } from 'https'
import Express from 'express'
import morgan from 'morgan'
import { HBCO } from './Objects/HBCO'
import { SocketServer } from './WebSocket/SocketServer'
import { routes } from './Routes/Routes'
import { HBOID } from './Constants'
import { IotDevice } from './Objects/IotDevice'
import { UiPage } from './Objects/UiPage'
import { UserProfile } from './Objects/UserProfile'

export interface HomeboardCoreOptions
{

  /* Enable TLS over HTTP */
  tls?: Boolean
  /* HTTP Server hostname */
  hostname?: string
  /* HTTP Server port */
  port?: number
  /* HTTP Server route prefix */
  routePrefix?: string
  /* HTTP Server Options (see https://nodejs.org/docs/latest-v12.x/api/http.html#http_http_createserver_options_requestlistener)*/
  httpServerOptions?: Object
  /* Socket.io Server options (see https://socket.io/docs/v4/server-api/#new-Server-httpServer-options)*/
  webSocketOptions?: Object

  /* List of UI pages */
  pages?: Array<UiPage>
  /* List of IOT devices */
  devices?: Array<IotDevice> 
  /* List of user profiles */
  userProfiles?: Array<UserProfile>
  /* Dashboard config */
  dashboard?: UiPage

}

export declare interface HomeboardCore 
{
  on(event: string, listener: Function): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'ready', listener: () => void): this;
  on(event: 'close', listener: () => void): this;

}

export class HomeboardCore extends HBCO
{
  
  private xpressApp: Express.Express = Express()
  private httpServer: HttpServer | HttpsServer
  private socketServer : SocketServer

  tls: Boolean
  hostname: string
  port: number
  routePrefix: string
  httpServerOptions: Object
  webSocketOptions: Object

  pages: Array<UiPage> = []
  devices: Array<IotDevice> = []
  userProfiles: Array<UserProfile> = []
  dashboard: UiPage = UiPage.DEFAULT_DASHBOARD()

  constructor(config: HomeboardCoreOptions)
  {
    super(HBOID.HOMEBOARD_CORE)
    
    this.tls = config.tls || false
    this.hostname = config.hostname || 'localhost'
    this.port = config.port || 3210
    this.routePrefix = config.routePrefix || '/API'
    this.httpServerOptions = config.httpServerOptions || {}
    this.webSocketOptions = config.webSocketOptions || {}

    this.pages = config.pages || []
    this.devices = config.devices || []
    this.userProfiles = config.userProfiles || []
    this.dashboard = config.dashboard || UiPage.DEFAULT_DASHBOARD()

    this.init()
    this.httpServer = this.tls ? createHttpsServer(this.httpServerOptions, this.xpressApp)
      : createHttpServer(this.httpServerOptions, this.xpressApp)
    this.socketServer = new SocketServer(this, this.httpServer, this.webSocketOptions)

    this.httpServer.listen(this.port);

    this.httpServer.on('error', (error) => {
      this.error('HttpServer throw an error', error)
      this.emit('error', error)
    });
    
    this.httpServer.on('listening', ()=> {
      this.debug(`HttpServer is now ready - ${this.url}`)
      this.emit('ready')
    });
    
    this.httpServer.on('close', ()=> {
      this.debug(`HttpServer is now closed`)
      this.emit('close')
    });

    console.log(this.brief())
  }

  init()
  {
    this.xpressApp.set('port', this.port);
    this.xpressApp.use(Express.static(path.join(__dirname, '../dist')));
    this.xpressApp.use(morgan('tiny'))
    this.xpressApp.use(this.routePrefix, routes(this))
  }

  get url()
  {
    return `${this.tls ? 'https' : 'http'}://${this.hostname}:${this.port}`
  }

  brief()
  {
    return {
      ...super.brief(),
      pages: this.getPagesBrief(),
      devices: this.getDevicesBrief(),
      userProfiles: this.getUserProfiles()
    }
  }

  getPagesBrief()
  {
    return this.pages.map(e => e.brief())
  }
  getPageByIndex(pageIdx: number): UiPage | undefined
  {
    return this.pages[pageIdx]
  }
  getPageByUid(pageUid: string): UiPage | undefined
  {
    return this.pages.find(e => e.uid === pageUid)
  }


  getDevicesBrief()
  {
    return this.devices.map(e => e.brief())
  }
  getDeviceById(deviceId: string)
  {
    return this.devices.find(e => e.uid === deviceId)
  }

  getDashboardForUser(userProfile: UserProfile)
  {
    return this.getPageByUid(userProfile.dashboardPageId)
  }


  getUserProfiles() {
    return this.userProfiles.map(e => e.brief())
  }
  getUserProfileByUid(uid: string)
  {
    return this.userProfiles.find(e => e.uid === uid)
  }

  computePage(pageOrUid: string | UiPage)
  {
    const page = pageOrUid instanceof UiPage ?  pageOrUid : this.getPageByUid(pageOrUid)
    return page ? page.compute({ 
      homeboardCore: this,
      getDeviceById: this.getDeviceById
    }) : {}
  }

  destroy()
  {
    this.debug('Destroying HomeboardCore instance...')
    if(this.httpServer && this.httpServer.listening) this.httpServer.close()
    if(this.socketServer) this.socketServer.close()
  }

}

