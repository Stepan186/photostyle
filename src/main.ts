import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
    ApiExceptionFilter,
    EntityNotFoundExceptionFilter,
    TrimPipe,
    validationPipeExceptionFactory,
} from '@1creator/backend';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalPipes(
        new TrimPipe(),
        new ValidationPipe({
            whitelist: true,
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: validationPipeExceptionFactory,
        }),
    );

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
        new ApiExceptionFilter(httpAdapter),
        new EntityNotFoundExceptionFilter(httpAdapter),
    );

    const config = new DocumentBuilder()
        .setTitle('Woci')
        .addBearerAuth()
        .setVersion('1.0')
        .addServer(process.env.BACKEND_URL!)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(process.env.BACKEND_PORT!);
}

bootstrap();