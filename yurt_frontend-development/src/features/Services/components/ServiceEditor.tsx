import Container from '@container/Container';
import React, { useEffect } from 'react';
import { Button, Form, FormProps, Input, InputNumber, Typography } from 'antd';
import styled from 'styled-components';
import { createService, fetchAllServices, updateService } from '@services/servicesThunks';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { IServiceMutation } from '~/types/service';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { selectServiceCreateLoading } from '@services/servicesSlice';

interface props {
  service?: IServiceMutation;
  serviceId: string;
  closeModal: boolean;
  visibleModal: (close: boolean) => void;
}

const ServiceEditor: React.FC<props> = ({ service, serviceId, closeModal, visibleModal }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Services', language);
  const loading = useAppSelector(selectServiceCreateLoading);

  useEffect(() => {
    if (closeModal) form.resetFields();
  }, [closeModal, form]);

  const submitFormHandler = async (values: IServiceMutation) => {
    if (serviceId) {
      try {
        await dispatch(updateService({ id: serviceId, serviceMutation: values }));
        await dispatch(fetchAllServices());
      } catch (e) {
        console.error(e);
      }
    } else {
      await dispatch(createService(values));
    }
    form.resetFields();
    visibleModal(false);
  };

  const onFinish: FormProps<IServiceMutation>['onFinish'] = (values) => {
    void submitFormHandler(values);
  };

  useEffect(() => {
    if (service) {
      form.setFieldsValue(service);
    }
  }, [service, form]);

  return (
    <Container>
      <Box>
        <Title level={4}>{serviceId ? translation.editService : translation.newService}</Title>
        <Form form={form} name='new-service' size='large' onFinish={onFinish}>
          <Form.Item
            name='title'
            rules={[{ required: true, message: translation.enterAboutService }]}
          >
            <Input placeholder={translation.about} autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='price'
            rules={[{ required: true, message: translation.enterPriceService }]}
          >
            <CustomInputNumber
              placeholder={translation.aboutPrice}
              addonAfter={translation.currency}
              min={1}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading} disabled={loading}>
              {serviceId ? translation.changeService : translation.addService}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Container>
  );
};
export default ServiceEditor;

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
