import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
    DEFAULT_APP_PORT,
    SWAGGER_CONFIG,
    APP_LOG_MESSAGES,
} from './common/constants/devices.constants';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
        .setTitle(SWAGGER_CONFIG.TITLE)
        .setDescription(SWAGGER_CONFIG.DESCRIPTION)
        .setVersion(SWAGGER_CONFIG.VERSION)
        .addTag(SWAGGER_CONFIG.TAGS.DEVICES)
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(SWAGGER_CONFIG.PATH, app, swaggerDocument);
    app.enableShutdownHooks(); // for OnModuleDestroy
    await app.listen(DEFAULT_APP_PORT);
}

bootstrap().catch((error) => {
    console.error(APP_LOG_MESSAGES.BOOTSTRAP_ERROR, error);
});