import { Test } from "@nestjs/testing";
import { AuthController } from "../api/auth.controller";
import { AuthService } from "../domain/auth.service";
import { LoginUserInputDTO, RegisterUserInputDTO } from "../api/dto/inputs";
import { LoginUserOutputDTO, RegisterUserOutputDTO } from "../api/dto/outputs";
import { userStub } from "./stubs/user.stub";
import { Messages } from "../../../common/constants";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;
    let accessToken: string = "access_token";
    let passwordResetToken: string = "password_reset_token";

    let mockAuthService = {
        register: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
        generatePasswordResetToken: jest.fn(),
        forgotUsername: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should register a new user", async () => {
            let registerUserInputDto: RegisterUserInputDTO;
            let registerUserOutput: RegisterUserOutputDTO;

            registerUserInputDto = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: "123",
            };
            registerUserOutput = { user: userStub(), accessToken };

            mockAuthService.register = jest
                .fn()
                .mockResolvedValueOnce({ user: userStub(), accessToken });

            const result = await authController.register(registerUserInputDto);

            expect(authService.register).toBeCalledWith(registerUserInputDto);
            expect(result).toEqual(registerUserOutput);
        });
    });

    describe("login", () => {
        it("should login a user", async () => {
            let loginUserInputDto: LoginUserInputDTO;
            let loginUserOutput: LoginUserOutputDTO;

            loginUserInputDto = { email: userStub().email, password: "123" };
            loginUserOutput = { user: userStub(), accessToken };

            mockAuthService.login = jest
                .fn()
                .mockResolvedValueOnce({ user: userStub(), accessToken });

            const result = await authController.login(loginUserInputDto);

            expect(authService.login).toBeCalledWith(loginUserInputDto);
            expect(result).toEqual(loginUserOutput);
        });
    });

    describe("logout", () => {
        it("should logout user and return a message", async () => {
            let id: string = userStub().id;
            let message = Messages.default.logout;

            let logoutOutput = { message };

            mockAuthService.logout = jest
                .fn()
                .mockResolvedValueOnce({ message });
            const result = await authController.logout(id);

            expect(authService.logout).toBeCalledWith(id);
            expect(result).toEqual(logoutOutput);
        });
    });

    describe("generatePasswordResetToken", () => {
        it("should return a reset token", async () => {
            let emailInputDto = { email: userStub().email };
            let passwordResetTokenOutputDto = { passwordResetToken };

            mockAuthService.generatePasswordResetToken = jest
                .fn()
                .mockResolvedValueOnce({ passwordResetToken });

            const result = await authController.generatePasswordResetToken(
                emailInputDto
            );

            expect(authService.generatePasswordResetToken).toBeCalledWith(
                emailInputDto.email
            );
            expect(result).toEqual(passwordResetTokenOutputDto);
        });
    });

    describe("forgotUsername", () => {
        it("should return a message", async () => {
            let emailInputDto = { email: userStub().email };
            let message = Messages.default.forgotUsername;
            let outputDto = { message };

            mockAuthService.forgotUsername = jest
                .fn()
                .mockResolvedValueOnce({ message });

            const result = await authController.forgotUsername(emailInputDto);

            expect(authService.forgotUsername).toBeCalledWith(
                emailInputDto.email
            );
            expect(result).toEqual(outputDto);
        });
    });
});
