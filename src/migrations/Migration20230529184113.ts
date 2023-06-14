import { Migration } from '@mikro-orm/migrations';

export class Migration20230529184113 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\', \'order\', \'project_prepayment\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\', \'order\', \'order_prepayment\'));');
  }

}
