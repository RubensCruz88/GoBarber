import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiMail, FiUser, FiLock,
} from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../util/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import logoImg from '../../assets/logo.svg';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface RegisterFormData {
	name: string;
	email: string,
	password: string,
}

const Register: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async (data: object) => {
    try {
		formRef.current?.setErrors({});

		const schema = Yup.object().shape({
		  name: Yup.string().required('Nome obrigatório'),
		  email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
		  password: Yup.string().min(6, 'Senha com no mínimo 6 cadacteres'),
		});

		await schema.validate(data, {
		  abortEarly: false,
		});

		await api.post('/users', data);

		addToast({
		  type: 'success',
		  title: 'Cadastro realizado',
		  description: 'Você já pode fazer seu logon no GoBarber',
		});

		history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

			formRef.current?.setErrors(errors);
		  } else {
        addToast({
			  type: 'error',
			  title: 'Erro no cadastro',
			  description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
		  }
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" placeholder="Nome" icon={FiUser} />
            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Input name="password" type="password" placeholder="Senha" icon={FiLock} />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>

  );
};

export default Register;
