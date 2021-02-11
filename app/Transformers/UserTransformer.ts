import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'

export default class UserTransformer extends TransformerAbstract {
  public transform(model) {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
    }
  }
}
