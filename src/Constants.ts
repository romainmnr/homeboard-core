/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
export enum HBOID
{
  HOMEBOARD_CORE = 'HomeboardCore',
  CONFIG_FILE = 'ConfigFile',
  WEB_SOCKET = 'WebSocket',
  SOCKET_SERVER = 'SocketServer',
  USER_PROFILE= 'UserProfile',
  UI_TILE = 'UiTile',
  UI_PAGE = 'UiPage',
  IOT_DEVICE = 'IotDevice',
  IOT_DEVICE_MATRIX = 'IotDeviceMatrix'
}

export enum UserRole
{
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}


export enum HBIconType
{
  ICON = 'icon',
  RAW = 'raw'
}

export enum HBValueUnit
{
  NONE = '',
  CELSIUS= '°C',

}




export interface HBValue
{
  type: '@HBValue',
  value: string | HBDynamicValue
  unit: HBValueUnit
}

export interface HBDynamicValue
{
  type: '@HBDynamicValue',
  default: any,
  script: string
}


export interface HBAction
{
  type: '@HBAction',
  default: any,
  script: string
}

export interface HBButton
{
  type: '@HBButton',
  color: string|HBDynamicValue,
  icon: string|HBDynamicValue,
  label: string|HBDynamicValue,
  onClick: HBAction,
}
export interface HBButtonGroup
{
  type: '@HBButtonGroup',
  mode: 'COMPACT' | 'FULL',
  buttons: Array<HBButton>
}

export interface HBSlider
{
  type: '@HBSlider',
  value: HBValue,
  lazy: Boolean,
  onChange: HBAction
}

export interface HBCounter
{
  type: '@HBCounter',
  value: HBValue,
  granularity: number,
  onChange: HBAction
}

export interface HBDoubleTile
{
  type: '@HBDoubleTile',
  title: string | HBDynamicValue,
  subtitle: string | HBDynamicValue,
  iconType: HBIconType,
  iconColor: string | HBDynamicValue,
  iconContent: string | HBDynamicValue,

  isIconClickable: Boolean,
  iconAction: HBAction,
  
  settingIcon: string,
  settingPanelType: string, // Type ID of setting panel to open    

}

