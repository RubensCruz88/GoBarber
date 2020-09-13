import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
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
			// deletar avatar anterior
			const userAvatarPath = path.join(
				uploadConfig.directory,
				user.avatar,
			);
			const userAvatarExists = await fs.promises.stat(userAvatarPath);

			if (userAvatarExists) {
				await fs.promises.unlink(userAvatarPath);
			}
		}
		user.avatar = avatarFilename;

		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
