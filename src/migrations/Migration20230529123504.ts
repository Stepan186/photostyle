import { Migration } from '@mikro-orm/migrations';

export class Migration20230529123504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment" drop constraint if exists "payment_type_check";');
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "agent" add column "watermark_uuid" uuid null;');
    this.addSql('alter table "agent" add constraint "agent_watermark_uuid_foreign" foreign key ("watermark_uuid") references "upload" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "agent" add constraint "agent_watermark_uuid_unique" unique ("watermark_uuid");');

    this.addSql('alter table "payment" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "payment" add constraint "payment_type_check" check ("type" in (\'invoice\', \'online\'));');
    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\', \'client\'));');
    this.addSql('alter table "payment" alter column "bank_payload" type jsonb using ("bank_payload"::jsonb);');
    this.addSql('alter table "payment" alter column "bank_payload" drop not null;');
    this.addSql('alter table "payment" alter column "paid_at" type timestamptz(0) using ("paid_at"::timestamptz(0));');
    this.addSql('alter table "payment" alter column "paid_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "agent" drop constraint "agent_watermark_uuid_foreign";');

    this.addSql('alter table "payment" drop constraint if exists "payment_type_check";');
    this.addSql('alter table "payment" drop constraint if exists "payment_table_check";');

    this.addSql('alter table "agent" drop constraint "agent_watermark_uuid_unique";');
    this.addSql('alter table "agent" drop column "watermark_uuid";');

    this.addSql('alter table "payment" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "payment" add constraint "payment_type_check" check ("type" in (\'invoice\', \'alfaBank\'));');
    this.addSql('alter table "payment" alter column "table" type text using ("table"::text);');
    this.addSql('alter table "payment" add constraint "payment_table_check" check ("table" in (\'agent\'));');
    this.addSql('alter table "payment" alter column "bank_payload" type jsonb using ("bank_payload"::jsonb);');
    this.addSql('alter table "payment" alter column "bank_payload" set not null;');
    this.addSql('alter table "payment" alter column "paid_at" type timestamptz(0) using ("paid_at"::timestamptz(0));');
    this.addSql('alter table "payment" alter column "paid_at" set not null;');
  }

}
