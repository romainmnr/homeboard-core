/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { HBCO } from './../Objects/HBCO'
import { Socket as WsSocket } from 'socket.io'
import { HBOID } from '../Constants'
import { HomeboardCore } from '../HomeboardCore'
import { UserProfile } from '../Objects/UserProfile'

export declare interface WebSocket 
{
  on(event: string, listener: () => void): this;
  on(event: 'disconnect', listener: () => void): this;

}



export class WebSocket extends HBCO
{
  
  private _socket: WsSocket
  readonly id: string

  hb: HomeboardCore
  userProfile: UserProfile|undefined = undefined

  constructor(hbInstance: HomeboardCore, socket: WsSocket)
  {
    super(HBOID.WEB_SOCKET)
    this._socket = socket
    this.id = socket.id
    this.hb = hbInstance


    this._socket.on('disconnect', () => {
      this.debug('Socket disconnected')
      this.emit('disconnect')
    });
  
  
    this._socket.on('pages.getall', () => {
      if(!this.isLogged()) return this.logout()
      this.debug('pages.getall')
      this._socket.emit('pages.getall.reply', this.hb.getPagesBrief())
    });
  
  
    this._socket.on('pages.get', (pageId) => {
      if(!this.isLogged()) return this.logout()

      this.debug('pages.get', pageId)
      if(!pageId && this.userProfile)
      {
        const page = this.hb.getDashboardForUser(this.userProfile)
        if (page) this._socket.emit('pages.get.reply', this.hb.computePage(page));
      }else{
        this._socket.emit('pages.get.reply', this.hb.computePage(pageId));
      }
    })

    this._socket.on('user-profiles.getall', () => {
      this.debug('user-profiles.getall')
      this._socket.emit('user-profiles.getall.reply', this.hb.getUserProfiles())
    })

    this._socket.on('user-profiles.select', (userUid) => {
      this.debug('user-profiles.select', userUid)
      const user = this.hb.getUserProfileByUid(userUid)
      if(user) {
        this.userProfile = user
        this._socket.emit('user-profiles.select.reply', user)
      }
    })

    // this._socket.on('playAction', (actionId) => {
    //   console.log(`[Homeboard] [SocketClient::${socket.id}] [on::playAction]`);
    // });
  
    // this._socket.on('calcDynamicValue', ({tileField, pageId, tileId}) => {
    //   console.log(`[Homeboard] [SocketClient::${socket.id}] [on::calcDynamicValue] ${pageId}  - ${tileField} - ${tileId}`);
    //   let page = localStorage.get('pages').find(e => e.id === pageId);
    //   if(!page) return false;
    //   let tile = page.tiles.find(e => e.id === tileId)
    //   if(!tile) return false;
    //   const value = evalDynValue(tile[tileField])
    //   socket.emit('calcDynamicValue.reply', {tileField, pageId, tileId, value: value})
    // });



    if(!this.isLogged()) this.logout()
  
  }


  isLogged(): boolean
  {
    return !!this.userProfile
  }

  logout(): void
  {
    this.userProfile = undefined
    this._socket.emit('user.logout')
  }

}
