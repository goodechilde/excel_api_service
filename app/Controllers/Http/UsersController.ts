import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import UserTransformer from 'App/Transformers/UserTransformer';

export default class UsersController {
  public async index ({ transform }: HttpContextContract) {
    const user = await User.all()
    return transform.collection(user, UserTransformer)
  }

  public async show ({ request, transform, params }: HttpContextContract) {
    const user = await User.find(params.id)
    return transform.item(user, UserTransformer)
  }
}
