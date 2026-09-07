import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaServerService } from './media-server.service';
import { WowzaMediaServerService } from './wowza-media-server.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: MediaServerService,
            useClass: WowzaMediaServerService,
        },
    ],
    exports: [MediaServerService],
})
export class MediaServerModule { }