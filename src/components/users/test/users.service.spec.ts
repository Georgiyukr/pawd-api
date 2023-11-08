import { Test } from "@nestjs/testing";
import { PaymentsService } from "../../../components/payments/payments.service";
import { HashService } from "../../../utils/hash.service";
import { UsersRepository } from "../data/users.repository";
import { UsersService } from "../domain/users.service";
import { CreateUser, NewUser, PaymentCustomer } from "../../../sharable/types";
import { userStub } from "../../../components/auth/test/stubs/user.stub";
import { User } from "../../../sharable/entities";
import { ConflictException } from "@nestjs/common";

describe("UsersService", () => {
    let usersService: UsersService;
    let hashService: HashService;
    let paymentsService: PaymentsService;
    let usersRepository: UsersRepository;

    let mockHashService = {
        makeHash: jest.fn(),
    };

    let mockPaymentsService = { createCustomer: jest.fn() };

    let mockUsersRepository = {
        createUser: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserById: jest.fn(),
        updateUser: jest.fn(),
        updateUserById: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: HashService, useValue: mockHashService },
                { provide: PaymentsService, useValue: mockPaymentsService },
                { provide: UsersRepository, useValue: mockUsersRepository },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        hashService = module.get<HashService>(HashService);
        paymentsService = module.get<PaymentsService>(PaymentsService);
        usersRepository = module.get<UsersRepository>(UsersRepository);

        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a user", async () => {
            const hashedPassword = "hashed password";
            const createUserInput: CreateUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: userStub().password,
            };

            const response = userStub();

            const getUserMock = jest
                .spyOn(usersService, "getUserByEmail")
                .mockResolvedValue(null);

            const hashMock = jest
                .spyOn(hashService, "makeHash")
                .mockResolvedValue(hashedPassword);

            const createStripeCustomerMock = jest
                .spyOn(paymentsService, "createCustomer")
                .mockResolvedValue({
                    id: userStub().paymentCustomerId,
                    email: userStub().email,
                } as PaymentCustomer);

            const builderMock = jest
                .spyOn(usersService, "buildNewUser")
                .mockReturnValue({
                    firstName: createUserInput.firstName,
                    lastName: createUserInput.lastName,
                    email: createUserInput.email,
                    password: hashedPassword,
                    dogName: createUserInput.dogName,
                    paymentCustomerId: userStub().paymentCustomerId,
                } as User);

            const createUserMock = jest
                .spyOn(usersRepository, "createUser")
                .mockResolvedValue(userStub());

            const result = await usersService.createUser(createUserInput);

            expect(getUserMock).toHaveBeenCalledWith(createUserInput.email);
            expect(hashMock).toHaveBeenCalledWith(userStub().password);
            expect(createStripeCustomerMock).toHaveBeenCalledWith({
                email: createUserInput.email,
                name: `${createUserInput.firstName} ${createUserInput.lastName}`,
            });
            expect(builderMock).toHaveBeenCalledWith({
                ...createUserInput,
                paymentCustomerId: userStub().paymentCustomerId,
            });
            expect(createUserMock).toHaveBeenCalled();

            expect(result).toEqual(response);
        });

        it("should throw ConflictException if user with provided email exists ", async () => {
            const createUserInput: CreateUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: userStub().password,
            };

            jest.spyOn(usersService, "getUserByEmail").mockResolvedValue(
                userStub()
            );

            const result = async () => {
                await usersService.createUser(createUserInput);
            };
            await expect(result()).rejects.toThrow(ConflictException);
            await expect(result).rejects.toThrowError(
                new ConflictException(
                    `User with email ${createUserInput.email} already exists.`
                )
            );
        });
    });

    describe("getUserByEmail", () => {
        it("should", async () => {
            expect(usersService.getUserByEmail).toBeDefined();
        });
    });

    describe("getUserById", () => {
        it("should define getUserById", async () => {
            expect(usersService.getUserById).toBeDefined();
        });
    });

    describe("updateUser", () => {
        it("should define updateUser", async () => {
            expect(usersService.updateUser).toBeDefined();
        });
    });

    describe("updateUserById", () => {
        it("should define updateUserById", async () => {
            expect(usersService.updateUserById).toBeDefined();
        });
    });

    describe("buildNewUser", () => {
        it("should correctly build user object", async () => {
            const userInput: NewUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                email: userStub().email,
                password: userStub().password,
                dogName: userStub().dogName,
                dogImage: "Image",
                paymentCustomerId: userStub().paymentCustomerId,
            };

            const result = await usersService.buildNewUser(userInput);

            expect(result).toEqual({
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                email: userStub().email,
                password: userStub().password,
                dogName: userStub().dogName,
                dogImage: "Image",
                paymentCustomerId: userStub().paymentCustomerId,
                totalUses: 0,
            });
        });
    });
});
