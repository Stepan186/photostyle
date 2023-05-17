import { Migration } from '@mikro-orm/migrations';

export class Migration20230515123349 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "agent" add column "fee" numeric(10,0) not null default 5;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "agent" drop column "fee";');
  }

}
