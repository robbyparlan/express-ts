import { SuccessResponse, HttpStatus } from '../utils/constant';
import { AuthLoginDTO } from '../dtos/auth.dto';
import { db, createError, logger } from '../utils/util'
import bcrypt from "bcrypt";

export class AuthRepository {

  async handleLogin(userDto: AuthLoginDTO): Promise<any> {
    try {
      let user = await db.select(db.raw(`
        mu.id as user_id,
        mu.username, mu.fullname, mu.email, mu."password", mu.is_active,
        jsonb_agg(jsonb_build_object(
          'menu_id', rm.id,
          'menu_name', rm.menu_name,
          'is_parent', rm.is_parent,
          'menu_id_parent', rm.parent_id,
          'order_no', rm.order_no
        )) as menus
        `))
        .from('m_user AS mu')
        .leftJoin(db.raw(`r_role AS rr on rr.role_id = mu.role_id`))
        .leftJoin(db.raw(`r_role_menu rrm on rrm.role_id = rr.role_id`))
        .leftJoin(db.raw(`(
            select *
            from r_menu rm 
            order by order_no ASC
          ) as rm on rm.id = rrm.menu_id
        `))
        .whereRaw(`mu.username = ?`, userDto.username)
        .groupByRaw(`mu.id`)

        if (user.length === 0) throw createError('Username tidak ditemukan!', HttpStatus.UNAUTHORIZED)
          user = user[0]
    
        const validPassword = await bcrypt.compare(userDto.password, user.password);
        if(!validPassword) throw createError('Password invalid!', HttpStatus.UNAUTHORIZED)
        delete user.password
  
        let tmpMenus = user.menus.filter((v: any) => !v.menu_id_parent)
  
        let tmpSubMenus = user.menus.filter((v: any) => v.menu_id_parent)
  
        let menus = tmpMenus.map((obj: any) => {
          obj.sub_menus = tmpSubMenus.filter((v: any) => v.menu_id_parent == obj.menu_id)
          return obj
        })
        user.menus = menus

        return user

    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}