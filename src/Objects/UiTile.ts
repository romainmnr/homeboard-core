/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { HBOID, 
  HBValue, 
  HBIconType,
  HBDynamicValue,
  HBAction,
  HBButton,
  HBButtonGroup,
  HBSlider,
  HBCounter,
  HBDoubleTile,
} from '../Constants'
import { jsonToStringOrDynVal, evalDynamicValue, EvalContext } from './../Modules/Tools'
import { HBCO } from './HBCO'


export interface UiTileOptions
{
  uid?:string
  size?: Number
  title?: string|HBDynamicValue
  subtitle?: string|HBDynamicValue
  iconType?: HBIconType
  iconColor?: string|HBDynamicValue
  iconContent?: string|HBDynamicValue
  isIconClickable?: Boolean
  iconAction?: HBAction
  settingIcon?: string
  settingPanelType?: string
  content?: any
}

/**
 * Basic class for IOT Device
 */
export class UiTile extends HBCO
{
  size: Number = 1
  title: string|HBDynamicValue = ''
  subtitle: string|HBDynamicValue = ''
  iconType: HBIconType  = HBIconType.ICON
  iconColor: string|HBDynamicValue = 'fa-home'
  iconContent: string|HBDynamicValue = ''
  isIconClickable: Boolean = false
  iconAction: HBAction|undefined = undefined
  settingIcon: string = 'fas fa-sliders-h'
  settingPanelType: string = 'none'
  content: any = undefined // Array<HBValue>|HBButtonGroup|HBSlider|HBCounter|HBDoubleTile|HBButton|undefined

  constructor(data: UiTileOptions)
  {
    super(HBOID.UI_TILE)
    Object.assign(this, data)
  }
  brief()
  {
    return {
      ...super.brief(),
      size: this.size,
      iconType: this.iconType,
      isIconClickable: this.isIconClickable,
      settingIcon: this.settingIcon,
      settingPanelType: this.settingPanelType,
      content: this.content
    }
  }

  compute(ctx: EvalContext)
  {
    ctx.tile = this
    return { 
      ...this.brief(),
      title: evalDynamicValue(this.title, ctx),
      subtitle: evalDynamicValue(this.subtitle, ctx),
      iconColor: evalDynamicValue(this.iconColor, ctx),
      iconContent: evalDynamicValue(this.iconContent, ctx),
    }
  }


  static contentFrom(data: { type: string})
  {
    switch (data.type) {
      case '@HBButtonGroup': return data as HBButtonGroup
      case '@HBSlider': return data as HBSlider
      case '@HBCounter': return data as HBCounter
      case '@HBDoubleTile': return data as HBDoubleTile
      case '@HBButton': return data as HBButton
      case '@HBValue': return data as HBValue
      default: return undefined
    }
  }

  static from(json: UiTileOptions)
  {

    let content = undefined


    if(json.content && Array.isArray(json.content)) {
      content = json.content.map(e => this.contentFrom(e))
    }else if(json.content) {
      content = this.contentFrom(json.content)
    }

    return new UiTile({...json,
      title: json.title ? jsonToStringOrDynVal(json.title) : undefined,
      subtitle:  json.subtitle ? jsonToStringOrDynVal(json.subtitle) : undefined,
      iconType: json.iconType ? json.iconType as HBIconType : undefined,
      iconColor:  json.iconColor ? jsonToStringOrDynVal(json.iconColor) : undefined,
      iconContent: json.iconContent ? jsonToStringOrDynVal(json.iconContent) : undefined,
      iconAction: json.iconAction ?  json.iconAction as HBAction : undefined,
      content
    })
  }

}