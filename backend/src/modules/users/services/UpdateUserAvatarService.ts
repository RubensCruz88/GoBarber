import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/Users';
import IUsersRepositories from '../repositories/IUsersRepositories';

interface IRequest {
	user_id: string;
	avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepositories,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError(
				'Only authenticated user can change avatar',
				401,
			);
		}

		if (user.avatar) {
			await this.storageProvider.deleteFile(user.avatar);
		}

		const fileName = await this.storageProvider.saveFile(avatarFilename);
		user.avatar = fileName;

		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;