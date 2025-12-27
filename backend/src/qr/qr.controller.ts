import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {QrService} from './qr.service';
import {Public} from "@/auth/public.decorator";

@Controller('api/qr')
export class QrController {
    constructor(private readonly qrService: QrService) {
    }

    @Get('generate')
    getQrHash() {
        return this.qrService.createHash();
    }

    @Public()
    @Post('generate')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@Body('hash') hash: string, @UploadedFile() file: Express.Multer.File) {
        if (!hash || !file) {
            throw new HttpException('Hash and image required', HttpStatus.BAD_REQUEST);
        }
        return await this.qrService.processImage(hash, file);
    }

    @Get('status/:hash')
    async getStatus(@Param('hash') hash: string) {
        return this.qrService.getStatus(hash);
    }

    @Get('status/:hash/unsubscribe')
    async deleteHash(@Param('hash') hash: string) {
        return this.qrService.deleteHash(hash);
    }
}
