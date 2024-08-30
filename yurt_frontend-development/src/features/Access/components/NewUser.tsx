import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import phone from 'phone';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { INewUser, INewUserMutation } from '~/types/user';
import { fetchUsers } from '@access/accessThunks';
import { returnTranslation } from '~/languages';
import { selectLanguage } from '@users/usersSlice';
import axiosApi from '~/axiosApi';
import { isAxiosError } from 'axios';
import { IValidationError } from '~/types/error';

interface Props {
  open: boolean;
  onCancel: () => void;
}

const NewUser: React.FC<Props> = ({ open, onCancel }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Access', language);

  const submitFormHandler = async (values: INewUserMutation) => {
    setLoading(true);
    const phoneResult = phone(values.phoneNumber, { country: 'KG' });
    if (!phoneResult.isValid) {
      void messageApi.error(
        {
          content: translation.showErrorMessage,
          style: { fontSize: '1rem' },
        },
        3,
      );
      return;
    }
    try {
      const correctValues: INewUser = {
        ...values,
        phoneNumber: phoneResult.phoneNumber,
        image: values.image?.fileList[0]?.originFileObj,
      };

      const formData = new FormData();
      const keys = Object.keys(correctValues) as (keyof INewUser)[];
      keys.forEach((key) => {
        const value = correctValues[key];
        if (value) {
          formData.append(key, value);
        }
      });

      await axiosApi.post('/users/register', formData);
      form.resetFields();
      setFileList([]);
      onCancel();
      await dispatch(fetchUsers());
      setLoading(false);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 422) {
        const error = e.response.data as IValidationError;
        Object.keys(error.error.errors).forEach((key) => {
          void messageApi.error(
            { content: error.error.errors[key].message, style: { fontSize: '1rem' } },
            3,
          );
        });
      } else {
        void messageApi.error(
          { content: 'Пользователь не добавлен!!', style: { fontSize: '1rem' } },
          3,
        );
      }
      form.resetFields();
      setFileList([]);
      onCancel();
      setLoading(false);
    }
  };

  const onFinish: FormProps<INewUserMutation>['onFinish'] = (values) => {
    void submitFormHandler(values);
  };

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const uploadProps: UploadProps = {
    accept: 'image/*',
    maxCount: 1,
    multiple: false,
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList: fileList,
  };

  return (
    <Modal forceRender open={open} onCancel={onCancel} footer={null}>
      {contextHolder}
      <Box>
        <Title level={4}>{translation.newManager}</Title>
        <Form form={form} name='new-user' size='large' onFinish={onFinish} autoComplete='off'>
          <Form.Item
            name='username'
            rules={[{ required: true, message: translation.enterNameManager }]}
          >
            <Input placeholder={translation.name} autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            rules={[{ required: true, message: translation.enterPhoneForManager }]}
          >
            <Input placeholder={translation.phoneNumber} autoComplete='off' />
          </Form.Item>
          <Form.Item name='image' valuePropName='image'>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>{translation.selectImage}</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading} disabled={loading}>
              {translation.addButton}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Modal>
  );
};

export default NewUser;

const Title = styled(Typography.Title)`
  text-align: center;
  padding-bottom: 10px;
`;

const Box = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
  max-width: 320px;
`;
