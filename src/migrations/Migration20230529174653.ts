import { Migration } from '@mikro-orm/migrations';

export class Migration20230529174653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "agent_feature" drop constraint "agent_feature_agent_uuid_feature_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "agent_feature" add constraint "agent_feature_agent_uuid_feature_id_unique" unique ("agent_uuid", "feature_id");');
  }

}
