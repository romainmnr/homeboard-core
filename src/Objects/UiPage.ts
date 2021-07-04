/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { HBOID } from '../Constants'
import { HBCO } from './HBCO'
import { UiTile } from './UiTile'
import { EvalContext } from './../Modules/Tools'

export interface UiPageOptions
{
  uid?:string
  /* Page Name */
  name?: string
  /* Page main Icon (fa-) */
  icon?: string
  /* Page tiles */
  tiles?: Array<UiTile>
}

/**
 * Basic class for IOT Device
 */
export class UiPage extends HBCO
{

  name: string
  icon: string
  tiles: Array<UiTile>

  constructor(data: UiPageOptions)
  {
    super(HBOID.UI_PAGE)
    if(data.uid) this.uid = data.uid
    this.name = data.name || 'Page'
    this.icon = data.icon || 'fas fa-home'
    this.tiles = data.tiles || []

  }

  brief()
  {
    return {
      ...super.brief(),
      name: this.name,
      icon: this.icon
    }
  }

  compute(ctx: EvalContext)
  {
    ctx.page = this
    return { ...this.brief(), tiles: this.tiles.map(e => e.compute(ctx)) }
  }
  
  static from(json: UiPageOptions)
  {
    let tiles:Array<UiTile> = []
    if(json.tiles && Array.isArray(json.tiles))
    {
      tiles = json.tiles.map(e => UiTile.from(e))
    }
    return new UiPage({ ...json, tiles })
  }

  static DEFAULT_DASHBOARD()
  {
    return new UiPage({
      uid:"dashboard",
      name: 'Dashboard',
      icon: 'fas fa-home',
      tiles: []
    })
  }
}
