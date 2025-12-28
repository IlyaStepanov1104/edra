import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {IS_PUBLIC_KEY} from './public.decorator';

@Injectable()
export class ClientTokenGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const req = context.switchToHttp().getRequest();

        const token =
            req.headers['x-client-token'] ||
            req.headers['X-Client-Token'];

        if (!token || typeof token !== 'string') {
            throw new UnauthorizedException('Client token missing');
        }

        // можно положить в request для сервисов
        req.clientToken = token;

        return true;
    }
}
