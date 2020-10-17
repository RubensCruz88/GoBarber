import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/fakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
	it('should be able to create a new appointment', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);

		const appointment = await createAppointment.execute({
			date: new Date(),
			provider_id: 'Loren Ipsum',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('Loren Ipsum');
	});

	it('should not be able to create two appointments on the same time', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);

		const appointmentDate = new Date(2020, 4, 10, 11);

		await createAppointment.execute({
			date: appointmentDate,
			provider_id: 'Loren Ipsum',
		});

		expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: 'Loren Ipsum',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
