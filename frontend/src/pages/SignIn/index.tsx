import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../util/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
	email: string;
	password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
		formRef.current?.setErrors({});

		const schema = Yup.object().shape({
		  email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
		  password: Yup.string().required('Senha obrigatória'),
		});

		await schema.validate(data, {
		  abortEarly: false,
		});

		await signIn({
		  email: data.email,
		  password: data.password,
		});

		history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

		formRef.current?.setErrors(errors);
      } else {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, verifique as credenciais',
        });
      }
    }
  }, [signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>
            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Input name="password" type="password" placeholder="Senha" icon={FiLock} />
            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to="register">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;