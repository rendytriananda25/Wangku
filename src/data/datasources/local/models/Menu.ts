import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Menu extends Model {
    static table = 'menus'

    @text('name') name!: string
    @text('category') category!: string
    @field('price') price!: number
    @text('image_url') imageUrl?: string

    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date
}