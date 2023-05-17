import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { LoadStrategy } from '@mikro-orm/core';
import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default (): Options => {
    return {
        debug: !!+process.env.DEBUG!,
        driver: PostgreSqlDriver,
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT!,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        dbName: process.env.DATABASE_NAME,
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        loadStrategy: LoadStrategy.SELECT_IN,
        highlighter: new SqlHighlighter(),
        metadataProvider: TsMorphMetadataProvider,
        migrations: {
            path: 'dist/migrations',
            pathTs: 'src/migrations',
        },
    };
};