
/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import vm from 'vm'
import { HomeboardCore } from './../HomeboardCore'
import { UiPage } from './../Objects/UiPage'
import { UiTile } from './../Objects/UiTile'
import { HBDynamicValue } from './../Constants'
import { IotDevice } from '../Objects/IotDevice'

export interface EvalContext
{

  homeboardCore?: HomeboardCore,
  page?: UiPage,
  tile?: UiTile,
  value?: HBDynamicValue

  getDeviceById?: (deviceId: string) => IotDevice | undefined
}


export function jsonToStringOrDynVal(value: string | Object)
{
  if(typeof value === 'string') return value
  return value as HBDynamicValue
}

export function evalDynamicValue(value: string | HBDynamicValue, ctx: EvalContext)
{
  if(!value) return undefined
  if(typeof value === 'string') return value
  if(!value.script || !value.script.trim()) return value.default

  try {
    const context = Object.assign(ctx, { result : undefined, value })
    vm.createContext(context);
    vm.runInContext(value.script, context);
    return context.result
  } catch (error) {
    console.error('Dynamic value evaluation failed: ', value, error)
    return value.default
  }
}