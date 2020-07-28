import { request } from 'express';
import path from 'path';
import fs from 'fs';

import { getRepository } from 'typeorm';
import User from '../models/Users';
import uploadConfig from '../config/upload';

interface Request {
	user_id: string;
	avatarFilename: string;
}

class UpdateUserAvatarService {
	public async execute({ user_id, avatarFilename }: Request): Promise<User> {
		const userRepository = getRepository(User);

		const user = await userRepository.findOne(user_id);

		if (!user) {
			throw new Error('Only authenticated user can change avatar');
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

		await userRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
