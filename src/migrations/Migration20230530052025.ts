import { Migration } from '@mikro-orm/migrations';

export class Migration20230530052025 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_user_uuid_foreign";');

    this.addSql('alter table "album_composition" drop constraint "album_composition_album_id_foreign";');
    this.addSql('alter table "album_composition" drop constraint "album_composition_owner_uuid_foreign";');

    this.addSql('alter table "cart" add constraint "cart_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "album_composition" add constraint "album_composition_album_id_foreign" foreign key ("album_id") references "album" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_composition" add constraint "album_composition_owner_uuid_foreign" foreign key ("owner_uuid") references "user" ("uuid") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_user_uuid_foreign";');

    this.addSql('alter table "album_composition" drop constraint "album_composition_album_id_foreign";');
    this.addSql('alter table "album_composition" drop constraint "album_composition_owner_uuid_foreign";');

    this.addSql('alter table "cart" add constraint "cart_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "album_composition" add constraint "album_composition_album_id_foreign" foreign key ("album_id") references "album" ("id") on update cascade;');
    this.addSql('alter table "album_composition" add constraint "album_composition_owner_uuid_foreign" foreign key ("owner_uuid") references "user" ("uuid") on update cascade;');
  }

}
