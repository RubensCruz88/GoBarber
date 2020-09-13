import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Users from '../infra/typeorm/entities/Users';
import IUsersRepositories from '../repositories/IUsersRepositories';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepositories,
	) {}

	public async execute({ name, email, password }: IRequest): Promise<Users> {
		const checkuserExists = await this.usersRepository.findByEmail(email);

		if (checkuserExists) {
			throw new AppError('Email address already used');
		}

		const hashPassword = await hash(password, 7);

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashPassword,
		});

		return user;
	}
}

export default CreateUserService;
