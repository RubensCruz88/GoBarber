import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';

interface IRequest {
	provider_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({
		provider_id,
		date,
	}: IRequest): Promise<Appointment> {
		const parsedDate = startOfHour(date);

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			parsedDate,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('this appointment is already booked');
		}

		const appointment = await this.appointmentsRepository.create({
			provider_id,
			date: parsedDate,
		});

		return appointment;
	}
}

export default CreateAppointmentService;
