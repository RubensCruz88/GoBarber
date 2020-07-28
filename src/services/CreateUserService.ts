import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import Users from '../models/Users';

interface Request {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	async execute({ name, email, password }: Request): Promise<Users> {
		const usersRepository = getRepository(Users);

		const checkuserExists = await usersRepository.findOne({
			where: { email },
		});

		if (checkuserExists) {
			throw new Error('Email address already used');
		}

		const hashPassword = await hash(password, 7);

		const user = usersRepository.create({
			name,
			email,
			password: hashPassword,
		});

		await usersRepository.save(user);

		return user;
	}
}

export default CreateUserService;
