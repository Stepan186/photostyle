import { Migration } from '@mikro-orm/migrations';

export class Migration20230529183342 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "project_user" add column "prepayment_balance" numeric(7,2) not null default 0, add column "prepayment_used" numeric(7,2) not null default 0;');

    this.addSql('alter table "payment" add column "user_uuid" uuid null, add column "order_uuid" uuid null;');
    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\', \'order\', \'order_prepayment\'));');
    this.addSql('alter table "payment" add constraint "payment_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "payment" add constraint "payment_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "payment" drop constraint "payment_user_uuid_foreign";');
    this.addSql('alter table "payment" drop constraint "payment_order_uuid_foreign";');

    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\', \'client\'));');
    this.addSql('alter table "payment" drop column "user_uuid";');
    this.addSql('alter table "payment" drop column "order_uuid";');

    this.addSql('alter table "project_user" drop column "prepayment_balance";');
    this.addSql('alter table "project_user" drop column "prepayment_used";');
  }

}
