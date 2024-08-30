import React, { ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, FormProps, Input, InputNumber, Typography } from 'antd';
import FileInput from '@fileInput/FileInput';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { createYurt, updateYurt } from '@yurts/yurtsThunks';
import { IYurtMutation } from '~/types/yurt';
import Container from '@container/Container';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { selectYurtCreateLoading } from '@yurts/yurtsSlice';

interface Props {
  yurt?: IYurtMutation;
  yurtId?: string;
  closeModal: boolean;
  visibleModal: (close: boolean) => void;
}

const YurtEditor: React.FC<Props> = ({ yurt, yurtId, closeModal, visibleModal }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Yurts', language);
  const loading = useAppSelector(selectYurtCreateLoading);
  useEffect(() => {
    if (yurt) {
      form.setFieldsValue(yurt);
    }
  }, [yurt, form]);

  const onChangeFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      form.setFieldsValue({ [name]: files[0] });
    }
  };

  if (closeModal) form.resetFields();

  const submitFormHandler = async (values: IYurtMutation) => {
    if (yurtId) {
      try {
        await dispatch(updateYurt({ id: yurtId, yurtMutation: values }));
      } catch (e) {
        console.error(e);
      }
    } else {
      await dispatch(createYurt(values));
    }
    form.resetFields();
    visibleModal(false);
  };

  const onFinish: FormProps<IYurtMutation>['onFinish'] = (values) => {
    void submitFormHandler(values);
  };

  return (
    <Container>
      <Box>
        <Title level={4}>{yurtId ? translation.editYurt : translation.newYurt}</Title>
        <Form form={form} name='yurt-form' size='large' onFinish={onFinish}>
          <Form.Item name='title' rules={[{ required: true, message: translation.entreNameYurt }]}>
            <Input placeholder={translation.nameYurt} autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='description'
            rules={[{ required: true, message: translation.entreDescriptionYurt }]}
          >
            <TextArea placeholder={translation.descriptionYurt} autoSize />
          </Form.Item>
          <Form.Item
            name='pricePerDay'
            rules={[{ required: true, message: translation.enterPriceYurt }]}
          >
            <CustomInputNumber
              placeholder={translation.price}
              addonAfter={translation.currency}
              min={1}
            />
          </Form.Item>
          <Form.Item
            name='image'
            valuePropName='file'
            rules={[{ required: !yurtId, message: translation.selectImage }]}
          >
            <FileInput onChange={onChangeFileInput} name='image' label={translation.image} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading} disabled={loading}>
              {yurtId ? translation.buttonSave : translation.buttonAdd}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Container>
  );
};

export default YurtEditor;

const { TextArea } = Input;

const Box = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
  max-width: 320px;
`;

const Title = styled(Typography.Title)`
  text-align: center;
  padding-bottom: 10px;
`;

const CustomInputNumber = styled(InputNumber)`
  width: 100%;
`;
