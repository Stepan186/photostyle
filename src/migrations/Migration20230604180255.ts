import { Migration } from '@mikro-orm/migrations';

export class Migration20230604180255 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "email_setting" ("id" serial primary key, "host" varchar(255) not null, "port" varchar(255) not null, "encryption" varchar(255) not null, "mail_from" varchar(255) not null, "user_name" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('create table "smtp_email" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "user_name" varchar(255) not null);');

    this.addSql('alter table "agent_transaction" drop constraint "agent_transaction_agent_uuid_foreign";');

    this.addSql('alter table "agent_feature" drop constraint "agent_feature_agent_uuid_foreign";');
    this.addSql('alter table "agent_feature" drop constraint "agent_feature_feature_id_foreign";');

    this.addSql('alter table "payment" drop constraint "payment_user_uuid_foreign";');

    this.addSql('alter table "agent_transaction" add constraint "agent_transaction_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "agent_feature" add constraint "agent_feature_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "agent_feature" add constraint "agent_feature_feature_id_foreign" foreign key ("feature_id") references "feature" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user" drop constraint "user_agent_uuid_unique";');

    this.addSql('alter table "payment" alter column "user_uuid" drop default;');
    this.addSql('alter table "payment" alter column "user_uuid" type uuid using ("user_uuid"::text::uuid);');
    this.addSql('alter table "payment" alter column "user_uuid" set not null;');
    this.addSql('alter table "payment" add constraint "payment_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "album_page" add column "fields" jsonb not null default \'[]\';');

    this.addSql('alter table "album_composition" add column "pages_fields" jsonb not null default \'[]\';');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "email_setting" cascade;');

    this.addSql('drop table if exists "smtp_email" cascade;');

    this.addSql('alter table "agent_feature" drop constraint "agent_feature_agent_uuid_foreign";');
    this.addSql('alter table "agent_feature" drop constraint "agent_feature_feature_id_foreign";');

    this.addSql('alter table "agent_transaction" drop constraint "agent_transaction_agent_uuid_foreign";');

    this.addSql('alter table "payment" drop constraint "payment_user_uuid_foreign";');

    this.addSql('alter table "agent_feature" add constraint "agent_feature_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete no action;');
    this.addSql('alter table "agent_feature" add constraint "agent_feature_feature_id_foreign" foreign key ("feature_id") references "feature" ("id") on update cascade on delete no action;');

    this.addSql('alter table "agent_transaction" add constraint "agent_transaction_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete no action;');

    this.addSql('alter table "album_composition" drop column "pages_fields";');

    this.addSql('alter table "album_page" drop column "fields";');

    this.addSql('alter table "payment" alter column "user_uuid" drop default;');
    this.addSql('alter table "payment" alter column "user_uuid" type uuid using ("user_uuid"::text::uuid);');
    this.addSql('alter table "payment" alter column "user_uuid" drop not null;');
    this.addSql('alter table "payment" add constraint "payment_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "user" add constraint "user_agent_uuid_unique" unique ("agent_uuid");');
  }

}
