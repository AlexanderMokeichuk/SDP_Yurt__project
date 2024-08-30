import Container from '@container/Container';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormProps, Input, message, Typography } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import { login } from './usersThunks';
import { selectLanguage, selectLoginError, selectLoginLoading } from './usersSlice';
import { ILoginMutation } from '~/types/authentication';
import phone from 'phone';
import ForgotPasswordNew from './components/ForgotPasswordNew';
import { returnTranslation } from '~/languages';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Users', language);

  useEffect(() => {
    if (error) {
      void messageApi.error({ content: error.error[language], style: { fontSize: '1rem' } }, 4);
    }
  }, [error, messageApi, language]);

  const onSubmitServer = async (values: ILoginMutation) => {
    const phoneResult = phone(values.phoneNumber, { country: 'KG' });
    if (!phoneResult.isValid) {
      void messageApi.error({ content: translation.messageApi }, 4);
      return;
    }
    await dispatch(login({ ...values, phoneNumber: phoneResult.phoneNumber })).unwrap();
    navigate('/');
  };

  const onFinish: FormProps<ILoginMutation>['onFinish'] = (values) => {
    void onSubmitServer(values);
    form.resetFields();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Background>
      <Container>
        {contextHolder}
        <Box>
          <Title level={3}>{translation.login}</Title>
          <Form form={form} name='login' onFinish={onFinish} size='large'>
            <Form.Item
              name='phoneNumber'
              rules={[{ required: true, message: translation.enterPhoneNumber }]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#d9d9d9' }} />}
                placeholder={translation.phoneNumber}
                autoComplete='phoneNumber'
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[{ required: true, message: translation.enterPassword }]}
              style={{ marginBottom: '0' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#d9d9d9' }} />}
                type='password'
                placeholder={translation.password}
                autoComplete='current-password'
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0' }}>
              <ForgotPasswordLink href='#' onClick={openModal}>
                {translation.forgotPassword}
              </ForgotPasswordLink>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} disabled={loading} block>
                {translation.toComeIn}
              </Button>
            </Form.Item>
          </Form>
        </Box>
      </Container>
      <ForgotPasswordNew closeModal={isModalOpen} visibleModal={closeModal} />
    </Background>
  );
};

export default Login;

const Background = styled.div`
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('/usonbak-landscape.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Box = styled.div`
  margin: auto;
  margin-top: 100px;
  background-color: #fff;
  border-radius: 15px;
  padding: 3rem;
  max-width: 380px;
`;

const ForgotPasswordLink = styled.a`
  float: right;
`;
const Title = styled(Typography.Title)`
  text-align: center;
  padding-bottom: 10px;
`;
