import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import Users from '@modules/users/infra/typeorm/entities/Users';
import { inject, injectable } from 'tsyringe';
import IUsersRepositories from '../repositories/IUsersRepositories';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	user: Users;
	token: string;
}

@injectable()
class AuthenticateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepositories,
	) {}

	public async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Incorrect email password combination', 401);
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new AppError('Incorrect email password combination', 401);
		}

		const token = sign({}, authConfig.jwt.secret, {
			subject: user.id,
			expiresIn: authConfig.jwt.expiresIn,
		});

		return { user, token };
	}
}

export default AuthenticateUserService;
