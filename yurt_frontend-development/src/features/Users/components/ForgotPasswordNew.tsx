import { Button, Flex, Form, FormProps, Image, Input, message, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import verifyIcon from '~/assets/verify.svg';
import { LeftOutlined, PhoneOutlined } from '@ant-design/icons';
import phone from 'phone';
import { useAppSelector } from '~/app/hooks';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import {
  INewPasswordMutation,
  IOTPChangePasswordRequest,
  IPhoneNumberRequest,
  IPhoneNumberResponse,
  IVerifyOTPRequest,
  IVerifyOTPResponse,
} from '~/types/authentication';
import axios, { isAxiosError } from 'axios';
import { API_URL } from '~/constants';
import { OTPProps } from 'antd/es/input/OTP';
import axiosApi from '~/axiosApi';
import { IApiNikitaError } from '~/types/error';

interface Props {
  closeModal: boolean;
  visibleModal: () => void;
}

const ForgotPasswordNew: React.FC<Props> = ({ closeModal, visibleModal }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const language = useAppSelector(selectLanguage);
  const [otpValue, setOtpValue] = useState<string | undefined>('');
  const translation = returnTranslation('Users', language);
  const [otpResponse, setOtpResponse] = useState<IPhoneNumberResponse | null>(null);
  const [otpVerifyResponse, setOtpVerifyResponse] = useState<IVerifyOTPResponse | null>(null);

  useEffect(() => {
    if (closeModal) {
      form.resetFields();
      setCurrent(0);
    }
  }, [closeModal, form]);

  const handleSendOTP = async (phoneNumber: string) => {
    try {
      if (phoneNumber) {
        const { data: response } = await axiosApi.post<IPhoneNumberResponse>('/users/send-otp', {
          phoneNumber,
        });
        setCurrent(1);
        setLoading(false);
        return setOtpResponse(response);
      }
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 500) {
        const error = e as IApiNikitaError;
        if (error.response?.data.error.status === 4) {
          void messageApi.error({ content: translation.outOfMoney }, 4);
        }
      } else if (isAxiosError(e) && e.response && e.response.status === 404) {
        void messageApi.error({ content: translation.notFoundNumber }, 4);
      } else {
        void messageApi.error({ content: translation.wrongNumber }, 4);
      }
      form.resetFields();
      setLoading(false);
      return setOtpResponse(null);
    }
  };

  const onPhoneNumberFormFinish: FormProps<IPhoneNumberRequest>['onFinish'] = (values) => {
    const phoneResult = phone(values.phoneNumber, { country: 'KG' });
    if (!phoneResult.isValid) {
      void messageApi.error({ content: translation.messageApi }, 4);
      return;
    }
    setLoading(true);
    setPhoneNumber(phoneResult.phoneNumber);
    void handleSendOTP(phoneResult.phoneNumber);
  };

  const handleVerifyOTP = async (data: IVerifyOTPRequest) => {
    try {
      const { data: response } = await axiosApi.post<IVerifyOTPResponse>('/users/verify-otp', data);
      setCurrent(2);
      setLoading(false);
      return setOtpVerifyResponse(response);
    } catch (e) {
      resetOTPField();
      setLoading(false);
      void messageApi.error({ content: translation.wrongCode }, 4);
    }
  };

  const onChange: OTPProps['onChange'] = (text) => {
    if (otpResponse) {
      setOtpValue(text);
      setLoading(true);
      void handleVerifyOTP({
        otpCode: text,
        phoneNumber: phoneNumber,
        nikitaToken: otpResponse.nikitaToken,
      });
      return;
    }
    setCurrent(0);
    form.resetFields();
  };

  const handleOnChangePassword = async (values: IOTPChangePasswordRequest) => {
    try {
      await axios.post(
        `${API_URL}/users/change-password-via-OTP`,
        { newPassword: values.newPassword },
        {
          headers: {
            Authorization: `Bearer ${values.jwtAccessToken}`,
          },
        },
      );

      setLoading(false);
      visibleModal();
      setCurrent(0);
      void messageApi.success({ content: translation.passwordUpdated }, 4);
    } catch (e) {
      void messageApi.error({ content: translation.failedChangePassword }, 4);
      setLoading(false);
      form.resetFields();
      setCurrent(0);
    }
  };

  const onChangePasswordFormFinish: FormProps<INewPasswordMutation>['onFinish'] = (values) => {
    if (otpVerifyResponse) {
      setLoading(true);
      void handleOnChangePassword({
        newPassword: values.newPassword,
        jwtAccessToken: otpVerifyResponse.jwtAccessToken,
      });
      return;
    }
    form.resetFields();
    setCurrent(0);
  };

  const handleBack = () => {
    setCurrent((prevState) => prevState - 1);
  };

  const resetOTPField = () => {
    setOtpValue('');
    form.resetFields(['otp']);
  };

  const steps = [
    {
      content: (
        <>
          <Image src={verifyIcon} preview={false} height={200} />
          <Title level={3}>{translation.titleEnterPhone}</Title>
          <Subtitle $marginBottom={30}>{translation.accessCodeSent}</Subtitle>
          <Form form={form} name='phoneNumberForm' onFinish={onPhoneNumberFormFinish}>
            <Form.Item
              name='phoneNumber'
              rules={[{ required: true, message: translation.enterPhoneNumber }]}
            >
              <Input
                size='large'
                prefix={<PhoneIcon />}
                placeholder={translation.phoneNumber}
                autoComplete='phoneNumber'
              />
            </Form.Item>
            <Form.Item>
              <ContinueButton
                name='continue'
                type='primary'
                htmlType='submit'
                disabled={loading}
                block
              >
                {translation.buttonContinue}
              </ContinueButton>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      content: (
        <>
          <BackButton icon={<LeftOutlined />} type='text' size='small' onClick={handleBack}>
            {translation.back}
          </BackButton>
          <Image src={verifyIcon} preview={false} height={200} />
          <Title level={3}>{translation.enterOTPCode}</Title>
          <Subtitle $marginBottom={20}>
            {translation.OTPCodeSentAnNumber} {phoneNumber}
          </Subtitle>
          <Form form={form} name='otpForm'>
            <FlexBox justify={'center'}>
              <Form.Item name='otp'>
                <Input.OTP size='large' value={otpValue} onChange={onChange} disabled={loading} />
              </Form.Item>
            </FlexBox>
            <ResendOTP>
              {translation.noCode}
              <Button
                type='link'
                size='small'
                onClick={() => {
                  void handleSendOTP(phoneNumber);
                }}
              >
                {translation.sendAgain}
              </Button>
            </ResendOTP>
          </Form>
        </>
      ),
    },
    {
      content: (
        <>
          <BackButton icon={<LeftOutlined />} type='text' size='small' onClick={handleBack}>
            {translation.back}
          </BackButton>
          <Image src={verifyIcon} preview={false} height={200} />
          <Title level={3} $marginBottom={10}>
            {translation.createNewPassword}
          </Title>
          <Form form={form} name='changePasswordForm' onFinish={onChangePasswordFormFinish}>
            <Form.Item
              name='newPassword'
              rules={[
                { required: true, message: translation.enterNewPassword },
                { min: 6, message: translation.minLength },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder={translation.password}
                size='large'
                autoComplete='new-password'
              />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: translation.confirmNewPassword },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(translation.errorPassword);
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder={translation.confirmPassword}
                size='large'
                autoComplete='new-password'
              />
            </Form.Item>

            <Form.Item>
              <ConfirmButton type='primary' htmlType='submit' disabled={loading} block>
                {translation.confirm}
              </ConfirmButton>
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  return (
    <ForgotPasswordModal open={closeModal} onCancel={visibleModal} footer={null} width={400}>
      <FlexBox vertical align='stretch'>
        {contextHolder}
        <>{steps[current].content}</>
      </FlexBox>
    </ForgotPasswordModal>
  );
};

export default ForgotPasswordNew;

const ForgotPasswordModal = styled(Modal)`
  .ant-modal-content {
    min-height: 505px;
  }
`;

const FlexBox = styled(Flex)`
  padding: 1rem 0;
  max-width: 300px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled(Typography.Title)<{ $marginBottom?: number }>`
  margin-top: 10px;
  margin-bottom: ${(props) => (props.$marginBottom ? props.$marginBottom : 5)}px !important;
  text-align: center;
`;

const Subtitle = styled(Typography.Text)<{ $marginBottom: number }>`
  font-size: 16px;
  margin-bottom: ${(props) => props.$marginBottom}px;
  text-align: center;
`;

const PhoneIcon = styled(PhoneOutlined)`
  color: #d9d9d9;
`;

const ContinueButton = styled(Button)`
  padding: 20px 15px;
  font-size: 17px;
`;

const ConfirmButton = styled(Button)`
  padding: 20px 15px;
  font-size: 17px;
`;

const BackButton = styled(Button)`
  position: absolute;
  align-self: start;
  z-index: 1000;
`;

const ResendOTP = styled.div`
  text-align: center;
`;
