import { Migration } from '@mikro-orm/migrations';

export class Migration20230529185508 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "agent" alter column "fee" type int using ("fee"::int);');

    this.addSql('alter table "payment" add column "order_uuid" uuid null;');
    this.addSql('alter table "payment" add constraint "payment_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" drop constraint "payment_order_uuid_foreign";');

    this.addSql('alter table "agent" alter column "fee" type numeric(10,0) using ("fee"::numeric(10,0));');

    this.addSql('alter table "payment" drop column "order_uuid";');
  }

}
