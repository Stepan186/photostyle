import { Migration } from '@mikro-orm/migrations';

export class Migration20230529184625 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" drop constraint "payment_order_uuid_foreign";');

    this.addSql('alter table "payment" add column "project_id" int null;');
    this.addSql('alter table "payment" add constraint "payment_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "payment" drop column "order_uuid";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" drop constraint "payment_project_id_foreign";');

    this.addSql('alter table "payment" add column "order_uuid" uuid null;');
    this.addSql('alter table "payment" add constraint "payment_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "payment" drop column "project_id";');
  }

}
