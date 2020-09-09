import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import registerBackgroundImage from '../../assets/register-background.png';

export const Container = styled.div`
	height: 100vh;
	display: flex;
	align-items: stretch;
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	place-content: center;
	width: 100%;
	max-width: 700px;
	align-items: center;

`;

const appearFromRight = keyframes`
	from {
		opacity: 0;
		transform: translateX(50px);
	},
	to {
		opacity: 1;
		transform: translateX(0px);
	}
`;

export const AnimationContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	animation: ${appearFromRight} 1s;

	form {
		margin: 80px 0;
		width: 340px;
		text-align: center;

		h1 {
			margin-bottom: 24px;
		}

		a {
			color: #F4EDE8;
			display: block;
			margin-top: 24px;
			text-decoration: none;
			transition: color 0.2s;

			&:hover {
				color: ${shade(0.2, '#F4EDE8')};
			}
		}
	}

	> a {
		color: #F4EDE8;
		display: block;
		margin-top: 24px;
		text-decoration: none;
		transition: color 0.2s;

		display: flex;
		align-items: center;

		svg {
			margin-right: 16px;
		}

		&:hover {
			color: ${shade(0.2, '#F4EDE8')};
		}
	}

`;

export const Background = styled.div`
	flex: 1;
	background: url(${registerBackgroundImage}) no-repeat center;
	background-size: cover;
`;