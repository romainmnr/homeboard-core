/******************************************
*             Homeboard Core
*          M-Dev - Romain Meunier
******************************************/
import { Router } from 'express'
import { HomeboardCore } from '../HomeboardCore';

export function routes(hbInstance: HomeboardCore)
{
  void(hbInstance)
  const  router = Router()





  router.get('/', (req, res) => { 
    void(req)
    res.send('Hello World')
  });
  

  return router
}

