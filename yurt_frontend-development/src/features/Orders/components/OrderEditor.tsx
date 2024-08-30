import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import phone from 'phone';
import axiosApi from '~/axiosApi';
import Container from '@container/Container';
import {
  AutoComplete,
  Button,
  DatePicker,
  Flex,
  Form,
  FormProps,
  GetProps,
  Input,
  InputNumber,
  message,
  Modal,
  type NotificationArgsProps,
  Select,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectUnblockedYurts } from '@yurts/yurtsSlice';
import { fetchUnblockedService } from '@services/servicesThunks';
import { selectUnblockedService } from '@services/servicesSlice';
import { DeleteOutlined } from '@ant-design/icons';
import { IClientFromDb } from '~/types/client';
import { fetchUnblockedYurts } from '@yurts/yurtsThunks';
import { createOrder, updateOrder } from '@orders/ordersThunks';
import {
  IDateOrder,
  IOrderFromDb,
  IOrderMutation,
  IOrderMutationEdit,
  IOrderToSend,
} from '~/types/order';
import { getClients } from '@clients/clientsThunks';
import { selectClients } from '@clients/clientsSlice';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import createXMLRequest from '~/createXMLRequest';
import axios from 'axios';
import { SMS_URL } from '~/constants';

type NotificationPlacement = NotificationArgsProps['placement'];

interface Props {
  open: boolean;
  onCansel: () => void;
  orderStateToEdit?: IOrderFromDb;
  toggleCancelFunction?: (id: string) => void;
  isToggleCancelHandler?: boolean;
  openNotification?: (placement: NotificationPlacement, status: string) => void;
}

interface IInitialState {
  id: string;
}

const OrderEditor: React.FC<Props> = ({
  onCansel,
  orderStateToEdit,
  open,
  isToggleCancelHandler,
  toggleCancelFunction,
  openNotification,
}) => {
  const yurtList = useAppSelector(selectUnblockedYurts);
  const serviceList = useAppSelector(selectUnblockedService);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [service, setService] = useState<IInitialState[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<IClientFromDb[]>([]);
  const allClients = useAppSelector(selectClients);
  const [unavailableDates, setUnavailableDates] = useState<IDateOrder[]>([]);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Orders', language);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setService([]);
      setClients([]);
      setUnavailableDates([]);
    }

    void dispatch(getClients());
    void dispatch(fetchUnblockedYurts('filter'));
    void dispatch(fetchUnblockedService('filter'));
    if (orderStateToEdit) {
      const { yurt, client, prepaid, orderDate, services } = orderStateToEdit;
      void onSearchDatesByYurt(yurt._id);
      form.setFieldValue('yurt', { value: yurt._id, label: yurt.title });
      form.setFieldValue('clientPhone', client.clientPhone);
      form.setFieldValue('clientName', client.clientName);
      form.setFieldValue('prepaid', prepaid);
      form.setFieldValue('orderDate', dayjs(orderDate));
      services.map((srv) => {
        const id = nanoid();
        setService((prevState) => [...prevState, { id: id }]);
        form.setFieldValue(`services ${id}`, [{ value: srv._id, label: srv.serviceTitle }]);
      });
    }
  }, [dispatch, form, orderStateToEdit, open]);

  const submitFormHandler = async (values: IOrderToSend) => {
    setLoading(true);
    const phoneResult = phone(values.clientPhone, { country: 'KG' });
    if (!phoneResult.isValid) {
      void messageApi.error({ content: translation.messageApiNumber }, 4);
      setLoading(false);
      return;
    }

    if (orderStateToEdit) {
      await dispatch(
        updateOrder({
          id: orderStateToEdit._id,
          data: { ...values, clientPhone: phoneResult.phoneNumber },
        }),
      );
      if (isToggleCancelHandler && isToggleCancelHandler === true && toggleCancelFunction) {
        void toggleCancelFunction(orderStateToEdit._id);
      }
    } else {
      const response = await dispatch(
        createOrder({ ...values, clientPhone: phoneResult.phoneNumber }),
      ).unwrap();
      if (response && openNotification) {
        const xmlRequest = createXMLRequest({
          yurt: response.yurt.title,
          clientPhone: response.client.clientPhone,
          clientName: response.client.clientName,
          orderDate: response.orderDate,
          prepaid: response.prepaid,
          totalPrice: response.totalPrice,
        });
        const data = await axios.post(SMS_URL, xmlRequest.xml, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });

        const XMLResponse = data.data as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(XMLResponse, 'text/xml');
        const status = xmlDoc.getElementsByTagName('status')[0].textContent;

        if (status) {
          openNotification('bottomRight', status);
        }
      }

      form.resetFields();
    }

    setLoading(false);
    onCansel();
  };

  const onFinish: FormProps<IOrderMutation | IOrderMutationEdit>['onFinish'] = (values) => {
    const serviceArr = Object.keys(values)
      .filter((srv) => srv.split(' ')[0] === 'services')
      .map((s) => {
        if (!values[s as keyof IOrderMutation]) {
          return;
        }
        const serviceAsObj = values[s as keyof IOrderMutation] as unknown as { value: string }[];

        return serviceAsObj[0].value || values[s as keyof IOrderMutation];
      })
      .filter((value) => value !== undefined);

    const newServiceArr = serviceArr.filter((item, index) => {
      return serviceArr.indexOf(item) === index;
    });

    const client = allClients.filter((client) => client.clientPhone === values.clientPhone);
    if (client.length > 0) {
      if (client[0].blocked) {
        void messageApi.error(
          {
            content: translation.messageApiBlocked,
          },
          4,
        );
        form.setFieldValue('clientPhone', null);
        form.setFieldValue('clientName', null);
        return;
      }
    }

    const servicePrices: number[] = [];
    newServiceArr.forEach((service) => {
      serviceList.forEach((item) => {
        if (service === item._id) {
          servicePrices.push(Number(item.price));
        }
      });
    });

    const yurtId = typeof values.yurt === 'string' ? values.yurt : values.yurt.value;
    const yurt = yurtList.filter((yurt) => {
      if (yurt._id === yurtId) {
        return yurt;
      }
    });

    const servicesSum = servicePrices.reduce((acc, price) => acc + Number(price), 0);
    const totalSum = yurt[0].pricePerDay + servicesSum;

    if (values.prepaid > totalSum) {
      void messageApi.error(
        {
          content: `${translation.prepaid}  ${totalSum} ${translation.currency}!!!`,
        },
        4,
      );
      form.setFieldValue('prepaid', null);
      return;
    }

    const isoDate = dayjs(values.orderDate).add(6, 'hours').toISOString();
    const currentDate = new Date(isoDate);
    currentDate.setUTCHours(0, 0, 0, 0);

    let dateIsBusy: IDateOrder | null = null;
    const findBusyDate = unavailableDates.filter((item) => {
      if (currentDate.toISOString() === item.orderDate.toString()) {
        return item;
      }
    });

    if (findBusyDate.length) dateIsBusy = findBusyDate[0];

    if (orderStateToEdit && dateIsBusy) {
      if (dateIsBusy._id !== orderStateToEdit._id) {
        form.setFieldValue('orderDate', null);
        void messageApi.error(
          {
            content: `${translation.thisYurtDateBlocked} ${dayjs(isoDate).format(`dd, D MMM, YYYY`)}`,
          },
          4,
        );
        return;
      }
    } else if (!orderStateToEdit && dateIsBusy) {
      form.setFieldValue('orderDate', null);
      void messageApi.error(
        {
          content: `${translation.thisYurtDateBlocked} ${dayjs(isoDate).format(`dd, D MMM, YYYY`)}`,
        },
        4,
      );
      return;
    }

    const finalObj: IOrderToSend = {
      yurt: typeof values.yurt === 'string' ? values.yurt : values.yurt.value,
      clientPhone: values.clientPhone,
      clientName: values.clientName,
      prepaid: values.prepaid,
      orderDate: isoDate,
      services: serviceArr as string[],
      commentaries: values.commentaries ? [{ text: String(values.commentaries) }] : [],
    };

    void submitFormHandler(finalObj);
  };

  const addService = () => {
    setService((prevState) => [...prevState, { id: nanoid(), delete: nanoid() }]);
  };

  const deleteService = (id: string) => {
    const services: IInitialState[] = service.filter((item) => {
      return item.id !== id;
    });
    setService(services);
  };

  const onSearch = async (value: string) => {
    if (value.length > 1) {
      const { data: clientList } = await axiosApi.get<IClientFromDb[]>(
        `/clients?clientPhone=${value}`,
      );
      setClients(clientList);
    }
  };

  const onSearchDatesByYurt = async (id: string) => {
    const { data: response } = await axiosApi.get<IDateOrder[]>(`/orders/orderDates/${id}?Id=yurt`);
    setUnavailableDates(response);
  };

  const onSelect = (data: string) => {
    const target = clients.filter((client) => client.clientPhone === data);
    form.setFieldsValue(target[0]);
  };

  const onSelectYurt = (id: string) => {
    void onSearchDatesByYurt(id);
  };

  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const newCurrent = dayjs(current).add(6, 'hours').toISOString();
    const currentDate = new Date(newCurrent);
    currentDate.setUTCHours(0, 0, 0, 0);

    let dateIsBusy: IDateOrder | null = null;
    const findBusyDate = unavailableDates.filter((item) => {
      if (currentDate.toISOString() === item.orderDate.toString()) {
        return item;
      }
    });
    if (findBusyDate.length) dateIsBusy = findBusyDate[0];

    if (dateIsBusy) {
      return !(orderStateToEdit && orderStateToEdit._id === dateIsBusy._id);
    }
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal open={open} onCancel={onCansel} footer={null}>
      <Container>
        {contextHolder}
        <Box>
          <Title level={4}>
            {orderStateToEdit ? translation.edit : translation.design} {translation.order}
          </Title>
          <Form
            form={form}
            name={orderStateToEdit ? 'edit-order' : 'new-order'}
            size='large'
            onFinish={onFinish}
          >
            <Form.Item name='yurt' rules={[{ required: true, message: translation.selectDate }]}>
              <Select
                onSelect={onSelectYurt}
                placeholder={translation.yurt}
                options={yurtList.map((yurt) => {
                  return { value: yurt._id, label: yurt.title };
                })}
              />
            </Form.Item>

            <Subtitle level={5}>{translation.client}</Subtitle>
            <Form.Item
              name='clientPhone'
              rules={[{ required: true, message: translation.selectClientNumber }]}
            >
              <AutoComplete
                placeholder={translation.phoneNumber}
                options={clients.map((client) => ({ value: client.clientPhone }))}
                onSelect={onSelect}
                onChange={(text) => void onSearch(text)}
              />
            </Form.Item>
            <Form.Item
              name='clientName'
              rules={[{ required: true, message: translation.enterClientName }]}
            >
              <Input placeholder={translation.client} autoComplete='off' />
            </Form.Item>

            <Subtitle level={5}>{translation.additionally}</Subtitle>
            <Form.Item name='prepaid'>
              <CustomInputNumber
                placeholder={translation.prepaidCode}
                addonAfter={translation.currency}
                min={0}
              />
            </Form.Item>
            <Form.Item
              name='orderDate'
              rules={[{ required: true, message: translation.selectDate }]}
            >
              <CustomDatePicker disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name='commentaries' required={false}>
              <Input.TextArea placeholder={translation.comment} />
            </Form.Item>

            {service.map((item) => {
              return (
                <BoxForSelect key={item.id}>
                  <ServiceField name={`services ${item.id}`}>
                    <Select
                      placeholder={translation.service}
                      options={serviceList.map((service) => {
                        return { value: service._id, label: service.title };
                      })}
                    />
                  </ServiceField>

                  <Button size={'large'} onClick={() => deleteService(item.id)}>
                    <DeleteOutlined />
                  </Button>
                </BoxForSelect>
              );
            })}
            <Form.Item>
              <BoxForButtons>
                <Button
                  block
                  type='primary'
                  htmlType='button'
                  onClick={addService}
                  id='new-order_addService'
                >
                  {translation.addService}
                </Button>

                <Button block type='primary' htmlType='submit' disabled={loading} loading={loading}>
                  {orderStateToEdit ? translation.save : translation.design}
                </Button>
              </BoxForButtons>
            </Form.Item>
          </Form>
        </Box>
      </Container>
    </Modal>
  );
};

export default OrderEditor;

const Box = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
  max-width: 370px;

  @media (max-width: 500px) {
    padding: 1rem 0;
  }
`;

const Title = styled(Typography.Title)`
  text-align: center;
  padding-bottom: 10px;
`;

const Subtitle = styled(Typography.Title)`
  opacity: 0.6;
`;

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
`;

const CustomInputNumber = styled(InputNumber)`
  width: 100%;
`;

const BoxForSelect = styled(Flex)`
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const ServiceField = styled(Form.Item)`
  width: calc(100% - 58px);
  margin-bottom: 0;
`;

const BoxForButtons = styled(Flex)`
  align-items: center;
  gap: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;
