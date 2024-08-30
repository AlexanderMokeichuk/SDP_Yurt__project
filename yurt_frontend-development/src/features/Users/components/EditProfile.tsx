import React, { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { Button, Form, FormProps, Input, Modal, Typography } from 'antd';
import { IEditUserMutation } from '~/types/user';
import styled from 'styled-components';
import FileInput from '@fileInput/FileInput';
import { editProfile } from '@users/usersThunks';
import { selectLanguage, selectUser, selectUserEditLoading } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

interface Props {
  open: boolean;
  onCancel: () => void;
}

const EditProfile: React.FC<Props> = ({ open, onCancel }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<IEditUserMutation>();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserEditLoading);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Users', language);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const onChangeFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      form.setFieldsValue({ [name]: files[0] });
    }
  };
  const submitFormHandler = async (values: IEditUserMutation) => {
    if (user) {
      await dispatch(editProfile({ edit: values, id: user.user._id })).unwrap();
    }
    onCancel();
  };

  const onFinish: FormProps<IEditUserMutation>['onFinish'] = (values) => {
    void submitFormHandler(values);
  };

  return (
    <Modal forceRender open={open} onCancel={onCancel} footer={null}>
      <Box>
        <Title level={4}>{translation.editProfile}</Title>
        <Form
          form={form}
          name='edit-user'
          initialValues={{ username: user?.user.username }}
          size='large'
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: translation.enterUserName }]}
          >
            <Input placeholder={translation.name} autoComplete='off' />
          </Form.Item>
          <Form.Item name='image' valuePropName='file'>
            <FileInput onChange={onChangeFileInput} name='image' label={translation.image} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading} disabled={loading}>
              {translation.saveButton}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Modal>
  );
};

export default EditProfile;

const Title = styled(Typography.Title)`
  text-align: center;
  padding-bottom: 10px;
`;

const Box = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
  max-width: 320px;
`;
