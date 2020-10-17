import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from './CreateUserService';

describe('CreateUser', () => {
	it('should be able to create a new user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUsersService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		const user = await createUser.execute({
			name: 'Fulano',
			email: 'fulano@teste.com.br',
			password: '123456',
		});

		expect(user).toHaveProperty('id');
	});

	it('should not be able to create more than one user with the same email', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUsersService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'Fulano',
			email: 'fulano@teste.com.br',
			password: '123456',
		});

		expect(
			createUser.execute({
				name: 'Fulano',
				email: 'fulano@teste.com.br',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
