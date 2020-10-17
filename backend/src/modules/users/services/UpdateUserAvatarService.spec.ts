import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
	it('should be able to create a new user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		const user = await fakeUsersRepository.create({
			name: 'Fulano',
			email: 'fulano@teste.com.br',
			password: '12456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'Loren_Ipsun.jpg',
		});

		expect(user.avatar).toBe('Loren_Ipsun.jpg');
	});

	it('should not be able to update avatar from non existent user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		expect(
			updateUserAvatar.execute({
				user_id: 'Sem_Usuario',
				avatarFilename: 'Loren_Ipsun.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('it should delete an old avatar when updating a new one', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		const user = await fakeUsersRepository.create({
			name: 'Fulano',
			email: 'fulano@teste.com.br',
			password: '12456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'Loren_Ipsun.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'Loren_Ipsun_2.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('Loren_Ipsun_2.jpg');
		expect(user.avatar).toBe('Loren_Ipsun_2.jpg');
	});
});
