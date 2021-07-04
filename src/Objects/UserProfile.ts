/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { HBCO } from './HBCO'
import { HBOID, UserRole } from '../Constants'

export interface UserProfileConfig
{
  uid?:string
  name?:string
  role?: UserRole
  imagePath?:string
  dashboardPageId?:string

  pagesIds?:Array<String> 
}

/**
 * Basic class for IOT Device
 */
export class UserProfile extends HBCO
{

  name: string = ''
  imagePath: string = ''
  role: UserRole = UserRole.USER
  dashboardPageId:string = ''

  pagesIds: Array<String> = []
  

  constructor(data: UserProfileConfig)
  {
    super(HBOID.USER_PROFILE)
    Object.assign(this, data)
  }

  brief()
  {
    return {
      ...super.brief(),
      name: this.name,
      imagePath: this.imagePath,
      role: this.role,
      dashboardPageId: this.dashboardPageId,
      pagesIds: this.pagesIds

    }
  }


}
