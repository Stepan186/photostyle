import { Migration } from '@mikro-orm/migrations';

export class Migration20230514001741 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "agent" ("uuid" uuid not null default gen_random_uuid(), "name" varchar(255) null, "mail_address" varchar(255) null, "legal_address" varchar(255) null, "email" varchar(255) null, "bik" varchar(255) null, "ogrn" varchar(255) null, "director" varchar(255) null, "inn" varchar(255) null, "kpp" varchar(255) null, "correspondent_account" varchar(255) null, "bank_account" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "agent_pkey" primary key ("uuid"));');

    this.addSql('create table "agent_transaction" ("uuid" uuid not null default gen_random_uuid(), "agent_uuid" uuid not null, "description" varchar(255) not null, "change" numeric(7,2) not null default 0, "balance" numeric(7,2) not null default 0, "created_at" timestamptz(0) not null, constraint "agent_transaction_pkey" primary key ("uuid"));');

    this.addSql('create table "feature" ("id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) null, "price" numeric(7,2) not null default 0, "image" varchar(255) null, constraint "feature_pkey" primary key ("id"));');

    this.addSql('create table "agent_feature" ("agent_uuid" uuid not null, "feature_id" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "agent_feature_pkey" primary key ("agent_uuid", "feature_id"));');
    this.addSql('alter table "agent_feature" add constraint "agent_feature_agent_uuid_feature_id_unique" unique ("agent_uuid", "feature_id");');

    this.addSql('create table "payment" ("uuid" uuid not null default gen_random_uuid(), "type" text check ("type" in (\'invoice\', \'alfaBank\')) not null, "table" text check ("table" in (\'agent\')) not null, "status" text check ("status" in (\'created\', \'pending\', \'succeeded\', \'failed\', \'refunded\')) not null, "description" varchar(255) not null, "total" numeric(7,2) not null default 0, "bank_payload" jsonb not null, "paid_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "created_at" timestamptz(0) not null, "fee" numeric(7,2) null default 0, "agent_uuid" uuid null, "agent_transaction_uuid" uuid null, constraint "payment_pkey" primary key ("uuid"));');
    this.addSql('create index "payment_table_index" on "payment" ("table");');
    this.addSql('alter table "payment" add constraint "payment_agent_transaction_uuid_unique" unique ("agent_transaction_uuid");');

    this.addSql('create table "project_permission" ("id" varchar(255) not null, "description" varchar(255) not null, constraint "project_permission_pkey" primary key ("id"));');

    this.addSql('create table "upload" ("uuid" uuid not null default gen_random_uuid(), "key" varchar(255) not null, "bucket" varchar(255) not null, "url" varchar(255) not null, "type" varchar(255) not null, "name" varchar(255) not null, "size" int not null, "sizes" jsonb null, "created_at" timestamptz(0) not null, constraint "upload_pkey" primary key ("uuid"));');

    this.addSql('create table "user" ("uuid" uuid not null default gen_random_uuid(), "first_name" varchar(255) null, "last_name" varchar(255) null, "phone" varchar(255) null, "is_agent" boolean not null default false, "is_admin" boolean not null default false, "email" varchar(255) not null, "telegram_chat_id" varchar(255) null, "agent_uuid" uuid null, "password" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "image_uuid" uuid null, constraint "user_pkey" primary key ("uuid"), constraint user_email_check check (email = lower(email)));');
    this.addSql('alter table "user" add constraint "user_phone_unique" unique ("phone");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_agent_uuid_unique" unique ("agent_uuid");');
    this.addSql('alter table "user" add constraint "user_image_uuid_unique" unique ("image_uuid");');

    this.addSql('create table "unloading" ("id" serial primary key, "total_cost" real null, "upload_uuid" uuid null, "user_uuid" uuid not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "refresh_token_meta" ("uuid" uuid not null, "device_name" varchar(255) not null, "device_ip" varchar(255) not null, "refresh_token" varchar(255) not null, "expires_at" timestamptz(0) not null, "user_uuid" uuid not null, constraint "refresh_token_meta_pkey" primary key ("uuid"));');

    this.addSql('create table "project_group" ("id" serial primary key, "name" varchar(255) not null, "owner_uuid" uuid not null);');

    this.addSql('create table "project" ("id" serial primary key, "name" varchar(255) not null, "public_name" varchar(255) not null, "city" varchar(255) not null, "share_template" varchar(255) null, "address" varchar(255) null, "shooting_date" timestamptz(0) null, "comment" varchar(255) null, "additional_information" varchar(255) null, "organizer_name" varchar(255) null, "organizer_person" varchar(255) null, "organizer_person_phone" varchar(255) null, "has_multiple_clients" boolean null default false, "request_client_address" boolean null default false, "sale_percent" int not null default 0, "sale_until" timestamptz(0) null, "archived_at" timestamptz(0) null, "password" varchar(255) null, "protected_password" varchar(255) null, "prepayment" numeric(7,2) not null default 0, "group_id" int null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint project_sale_percent_check check (sale_percent >= 0 AND sale_percent <= 100));');

    this.addSql('create table "project_user" ("user_uuid" uuid not null, "project_id" int not null, "role" text check ("role" in (\'owner\', \'employee\', \'organizer\', \'client\')) not null, "is_favorite" boolean not null default false, "invite_uuid" uuid null, constraint "project_user_pkey" primary key ("user_uuid", "project_id"));');
    this.addSql('alter table "project_user" add constraint "project_user_user_uuid_project_id_unique" unique ("user_uuid", "project_id");');

    this.addSql('create table "project_user_permissions" ("project_user_user_uuid" uuid not null, "project_user_project_id" int not null, "project_permission_id" varchar(255) not null, constraint "project_user_permissions_pkey" primary key ("project_user_user_uuid", "project_user_project_id", "project_permission_id"));');

    this.addSql('create table "directory" ("id" serial primary key, "name" varchar(255) not null, "comment" varchar(255) null, "parent_id" int null, "tree_id" int null, "tree_left" int null, "tree_right" int null, "tree_level" int null, "project_id" int not null, "watermark_opacity" real not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "photo" ("id" serial primary key, "original_uuid" uuid not null, "watermarked_uuid" uuid null, "directory_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "photo" add constraint "photo_original_uuid_unique" unique ("original_uuid");');
    this.addSql('alter table "photo" add constraint "photo_watermarked_uuid_unique" unique ("watermarked_uuid");');

    this.addSql('create table "price_list" ("id" serial primary key, "name" varchar(255) not null, "user_uuid" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "project_price" ("id" serial primary key, "project_id" int not null, "price_list_id" int not null, "expires_at" timestamptz(0) null);');

    this.addSql('create table "price_item" ("id" serial primary key, "price" numeric(7,2) not null default 0, "name" varchar(255) not null, "service_name" varchar(255) not null, "list_id" int not null, "is_electronic" boolean not null default false);');

    this.addSql('create table "price_item_examples" ("price_item_id" int not null, "upload_uuid" uuid not null, constraint "price_item_examples_pkey" primary key ("price_item_id", "upload_uuid"));');

    this.addSql('create table "directory_disabled_price_items" ("directory_id" int not null, "price_item_id" int not null, constraint "directory_disabled_price_items_pkey" primary key ("directory_id", "price_item_id"));');

    this.addSql('create table "order" ("uuid" uuid not null default gen_random_uuid(), "id" varchar(255) not null, "creator_uuid" uuid not null, "user_uuid" uuid not null, "status" text check ("status" in (\'cart\', \'new\', \'payment\', \'work\', \'completed\')) not null default \'cart\', "project_id" int not null, "created_at" timestamptz(0) not null, "completed_at" timestamptz(0) null, "updated_at" timestamptz(0) not null, "address" varchar(255) null, "comment" varchar(255) null, "private_comment" varchar(255) null, "total" numeric(7,2) not null default 0, "sale" int not null default 0, "sale_percent" int not null default 0, "should_unload" boolean not null default false, constraint "order_pkey" primary key ("uuid"));');
    this.addSql('alter table "order" add constraint "order_id_unique" unique ("id");');

    this.addSql('create table "unloading_orders" ("unloading_id" int not null, "order_uuid" uuid not null, constraint "unloading_orders_pkey" primary key ("unloading_id", "order_uuid"));');

    this.addSql('create table "order_photo" ("order_uuid" uuid not null, "photo_id" int not null, "price_item_id" int not null, "count" int not null, "price" numeric(7,2) not null default 0, "sale" numeric(7,2) not null default 0, constraint "order_photo_pkey" primary key ("order_uuid", "photo_id", "price_item_id"));');

    this.addSql('create table "notification_settings" ("user_uuid" uuid not null, "email" boolean not null default true, "updated_at" timestamptz(0) null, constraint "notification_settings_pkey" primary key ("user_uuid"));');

    this.addSql('create table "notification" ("id" serial primary key, "user_uuid" uuid not null, "title" varchar(255) not null, "text" varchar(255) not null, "payload" jsonb null, "read_at" timestamptz(0) null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null);');

    this.addSql('create table "cart" ("uuid" uuid not null default gen_random_uuid(), "user_uuid" uuid not null, "project_id" int not null, "comment" varchar(255) null, "address" varchar(255) null, constraint "cart_pkey" primary key ("uuid"));');

    this.addSql('create table "cart_photo" ("cart_uuid" uuid not null, "photo_id" int not null, "price_item_id" int not null, "count" int not null, constraint "cart_photo_pkey" primary key ("cart_uuid", "photo_id", "price_item_id"));');

    this.addSql('create table "album" ("id" serial primary key, "name" varchar(255) not null, "project_id" int null, "owner_uuid" uuid not null, "price" numeric(7,2) not null default 0, "image_uuid" uuid null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "album_page" ("id" serial primary key, "price" numeric(7,2) not null default 0, "comment" varchar(255) null, "album_id" int not null, "background_uuid" uuid not null, "ordering" int not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "album_page_region" ("id" serial primary key, "is_protected" boolean not null default false, "comment" varchar(255) null, "page_id" int not null, "photo_id" int null, "details" jsonb not null, "name" varchar(255) null);');

    this.addSql('create table "album_composition" ("id" serial primary key, "album_id" int not null, "owner_uuid" uuid not null);');

    this.addSql('create table "order_album" ("id" serial primary key, "price" numeric(7,2) not null default 0, "count" int not null, "composition_id" int not null, "order_uuid" uuid not null, "sale" numeric(7,2) not null default 0);');

    this.addSql('create table "cart_album" ("id" serial primary key, "count" int not null, "composition_id" int not null, "cart_uuid" uuid not null);');

    this.addSql('create table "album_composition_region" ("composition_id" int not null, "region_id" int not null, "photo_id" int not null, "comment" varchar(255) null, constraint "album_composition_region_pkey" primary key ("composition_id", "region_id"));');

    this.addSql('create table "album_composition_page" ("composition_id" int not null, "page_id" int not null, "comment" varchar(255) null, constraint "album_composition_page_pkey" primary key ("composition_id", "page_id"));');

    this.addSql('create table "album_composition_paid_pages" ("album_composition_id" int not null, "album_page_id" int not null, constraint "album_composition_paid_pages_pkey" primary key ("album_composition_id", "album_page_id"));');

    this.addSql('alter table "agent_transaction" add constraint "agent_transaction_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade;');

    this.addSql('alter table "agent_feature" add constraint "agent_feature_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade;');
    this.addSql('alter table "agent_feature" add constraint "agent_feature_feature_id_foreign" foreign key ("feature_id") references "feature" ("id") on update cascade;');

    this.addSql('alter table "payment" add constraint "payment_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "payment" add constraint "payment_agent_transaction_uuid_foreign" foreign key ("agent_transaction_uuid") references "agent_transaction" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "user" add constraint "user_agent_uuid_foreign" foreign key ("agent_uuid") references "agent" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_image_uuid_foreign" foreign key ("image_uuid") references "upload" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "unloading" add constraint "unloading_upload_uuid_foreign" foreign key ("upload_uuid") references "upload" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "unloading" add constraint "unloading_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "refresh_token_meta" add constraint "refresh_token_meta_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "project_group" add constraint "project_group_owner_uuid_foreign" foreign key ("owner_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "project" add constraint "project_group_id_foreign" foreign key ("group_id") references "project_group" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project_user" add constraint "project_user_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "project_user" add constraint "project_user_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project_user_permissions" add constraint "project_user_permissions_project_user_user_uuid_p_d5679_foreign" foreign key ("project_user_user_uuid", "project_user_project_id") references "project_user" ("user_uuid", "project_id") on update cascade on delete cascade;');
    this.addSql('alter table "project_user_permissions" add constraint "project_user_permissions_project_permission_id_foreign" foreign key ("project_permission_id") references "project_permission" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "directory" add constraint "directory_parent_id_foreign" foreign key ("parent_id") references "directory" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "directory" add constraint "directory_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "photo" add constraint "photo_original_uuid_foreign" foreign key ("original_uuid") references "upload" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "photo" add constraint "photo_watermarked_uuid_foreign" foreign key ("watermarked_uuid") references "upload" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "photo" add constraint "photo_directory_id_foreign" foreign key ("directory_id") references "directory" ("id") on update cascade on delete no action;');

    this.addSql('alter table "price_list" add constraint "price_list_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "project_price" add constraint "project_price_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "project_price" add constraint "project_price_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade;');

    this.addSql('alter table "price_item" add constraint "price_item_list_id_foreign" foreign key ("list_id") references "price_list" ("id") on update cascade;');

    this.addSql('alter table "price_item_examples" add constraint "price_item_examples_price_item_id_foreign" foreign key ("price_item_id") references "price_item" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "price_item_examples" add constraint "price_item_examples_upload_uuid_foreign" foreign key ("upload_uuid") references "upload" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "directory_disabled_price_items" add constraint "directory_disabled_price_items_directory_id_foreign" foreign key ("directory_id") references "directory" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "directory_disabled_price_items" add constraint "directory_disabled_price_items_price_item_id_foreign" foreign key ("price_item_id") references "price_item" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "order" add constraint "order_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade;');
    this.addSql('alter table "order" add constraint "order_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');
    this.addSql('alter table "order" add constraint "order_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "unloading_orders" add constraint "unloading_orders_unloading_id_foreign" foreign key ("unloading_id") references "unloading" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "unloading_orders" add constraint "unloading_orders_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "order_photo" add constraint "order_photo_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "order_photo" add constraint "order_photo_photo_id_foreign" foreign key ("photo_id") references "photo" ("id") on update cascade;');
    this.addSql('alter table "order_photo" add constraint "order_photo_price_item_id_foreign" foreign key ("price_item_id") references "price_item" ("id") on update cascade;');

    this.addSql('alter table "notification_settings" add constraint "notification_settings_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "notification" add constraint "notification_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "cart" add constraint "cart_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');
    this.addSql('alter table "cart" add constraint "cart_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "cart_photo" add constraint "cart_photo_cart_uuid_foreign" foreign key ("cart_uuid") references "cart" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "cart_photo" add constraint "cart_photo_photo_id_foreign" foreign key ("photo_id") references "photo" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "cart_photo" add constraint "cart_photo_price_item_id_foreign" foreign key ("price_item_id") references "price_item" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "album" add constraint "album_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album" add constraint "album_owner_uuid_foreign" foreign key ("owner_uuid") references "user" ("uuid") on update cascade;');
    this.addSql('alter table "album" add constraint "album_image_uuid_foreign" foreign key ("image_uuid") references "upload" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "album_page" add constraint "album_page_album_id_foreign" foreign key ("album_id") references "album" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_page" add constraint "album_page_background_uuid_foreign" foreign key ("background_uuid") references "upload" ("uuid") on update cascade;');

    this.addSql('alter table "album_page_region" add constraint "album_page_region_page_id_foreign" foreign key ("page_id") references "album_page" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_page_region" add constraint "album_page_region_photo_id_foreign" foreign key ("photo_id") references "photo" ("id") on update cascade on delete set null;');

    this.addSql('alter table "album_composition" add constraint "album_composition_album_id_foreign" foreign key ("album_id") references "album" ("id") on update cascade;');
    this.addSql('alter table "album_composition" add constraint "album_composition_owner_uuid_foreign" foreign key ("owner_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "order_album" add constraint "order_album_composition_id_foreign" foreign key ("composition_id") references "album_composition" ("id") on update cascade;');
    this.addSql('alter table "order_album" add constraint "order_album_order_uuid_foreign" foreign key ("order_uuid") references "order" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "cart_album" add constraint "cart_album_composition_id_foreign" foreign key ("composition_id") references "album_composition" ("id") on update cascade;');
    this.addSql('alter table "cart_album" add constraint "cart_album_cart_uuid_foreign" foreign key ("cart_uuid") references "cart" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "album_composition_region" add constraint "album_composition_region_composition_id_foreign" foreign key ("composition_id") references "album_composition" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_composition_region" add constraint "album_composition_region_region_id_foreign" foreign key ("region_id") references "album_page_region" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_composition_region" add constraint "album_composition_region_photo_id_foreign" foreign key ("photo_id") references "photo" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "album_composition_page" add constraint "album_composition_page_composition_id_foreign" foreign key ("composition_id") references "album_composition" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_composition_page" add constraint "album_composition_page_page_id_foreign" foreign key ("page_id") references "album_page" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "album_composition_paid_pages" add constraint "album_composition_paid_pages_album_composition_id_foreign" foreign key ("album_composition_id") references "album_composition" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "album_composition_paid_pages" add constraint "album_composition_paid_pages_album_page_id_foreign" foreign key ("album_page_id") references "album_page" ("id") on update cascade on delete cascade;');
  }

}
