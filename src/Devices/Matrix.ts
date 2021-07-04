/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { IotDevice } from './../Objects/IotDevice'
import { HBOID } from './../Constants'


export enum MatrixState
{
  OFF = 'off',
  AUTO = 'auto',
  INIT = 'init',
  FILL_FADE = 'fillFade',
  RAINBOW = 'rainbow',
  RANDOM_PX_2 = 'randomPixel2',
  TRACE = 'trace',
  ROW = 'row',
  COL = 'col',
  CROSS = 'cross',
  DOUBLE_CROSS = 'doubleCross',
  GRID = 'grid',
  GRID_R = 'gridR',
  SQUARES = 'squares',
  BIN_CLOCK = 'binclock',
  CLOCK = 'clock',
  CLOCK2 = 'clock2',
}

export class MatrixColor
{
  color: Array<number> = [0,0,0,0]

  constructor(red: number, green: number, blue: number, white?: number)
  {
    this.red = red
    this.green = green
    this.blue = blue
    this.white = white || 0
  }

  cleanValue(value: number)
  {
    return Math.min(255, Math.max(0, value))
  }

  get red(){ return this.color[0] }
  get green(){ return this.color[1] }
  get blue(){ return this.color[2] }
  get white(){ return this.color[3] }

  set red(value: number){ this.color[0] = this.cleanValue(value) }
  set green(value: number){ this.color[1] = this.cleanValue(value)}
  set blue(value: number){ this.color[2] = this.cleanValue(value)}
  set white(value: number){ this.color[3] = this.cleanValue(value)}


  static fromArray(arr: Array<number>)
  {
    return new MatrixColor(arr[0], arr[1], arr[2], arr[3])
  }
}

export class Matrix extends IotDevice
{

  hostname: string
  runningAction: MatrixState = MatrixState.OFF
  runningActionParams: Array<any> = []
  delay: number = 100 // in ms
  brightness:number = 1 // value between 0 and 1
  currentColor: MatrixColor = new MatrixColor(255, 255, 255, 255);
  randomColor: Boolean = false

  constructor(deviceId: string, host: string)
  {
    super(HBOID.IOT_DEVICE_MATRIX, deviceId)
    this.hostname = host
    
  }

  init()
  {
    this.getStatus()
    return this
  }

  getStatus()
  {
    this.httpAgent.get(this.hostname, { params: { type: 'json' } })
      .then((response) => {
        if(response.data)
        {
          const pl = response.data
          this.runningAction = pl.runningAction as MatrixState
          this.runningActionParams = pl.runningActionParams
          this.delay = pl.delay
          this.brightness =  pl.brightness
          this.currentColor =  MatrixColor.fromArray(pl.currentColor)
          this.randomColor = pl.randomColor ? true : false

          this.emit('updated', this)
        }
      })
      .catch((err) => {
        this.error('An error occured retreiving Matrix data', err)
        this.emit('error', err)
      })
  }

}
