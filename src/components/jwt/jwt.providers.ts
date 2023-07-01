import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export const JWT_ACCCESS_TOKEN_SERVICE = "JWT_ACCCESS_TOKEN_SERVICE";
export const JWT_REFRESH_TOKEN_SERVICE = "JWT_REFRESH_TOKEN_SERVICE";

export const JwtAccessTokenProvider: Provider = {
    provide: JWT_ACCCESS_TOKEN_SERVICE,
    useExisting: JwtService,
};

export const JwtRefreshTokenProvider: Provider = {
    provide: JWT_REFRESH_TOKEN_SERVICE,
    useExisting: JwtService,
};
