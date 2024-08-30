import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  List,
  message,
  notification,
  type NotificationArgsProps,
  Popconfirm,
  Popover,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { API_URL, SMS_URL } from '~/constants';
import { IComment, IOrderError, IOrderFromDb, IRangeDatesMutation } from '~/types/order';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { IServiceWithBookingPrice } from '~/types/service';
import {
  CheckOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  EditOutlined,
  FieldTimeOutlined,
  MailOutlined,
  StopOutlined,
} from '@ant-design/icons';
import OrderEditor from './components/OrderEditor';
import { nanoid } from 'nanoid';
import {
  selectOrders,
  selectOrdersAddCommentLoading,
  selectOrdersLoading,
  toggleCancelOrder,
} from '@orders/ordersSlice';
import { addComment, fetchAllOrders } from '@orders/ordersThunks';
import { RangePickerProps } from 'antd/lib/date-picker';
import { selectLanguage, selectUser } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import axiosApi from '~/axiosApi';
import axios, { isAxiosError } from 'axios';
import createXMLRequest from '~/createXMLRequest';

type NotificationPlacement = NotificationArgsProps['placement'];

dayjs.locale('ru');
const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectOrdersLoading);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [api, contextHolderNotification] = notification.useNotification();
  const orders = useAppSelector(selectOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderState, setOrderState] = useState<IOrderFromDb>();
  const [restoreToggleCanceled, setRestoreToggleCanceled] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [form] = Form.useForm();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Orders', language);
  const user = useAppSelector(selectUser);
  const [datesToFilter, setDatesToFilter] = useState<IRangeDatesMutation>({
    dateFrom: undefined,
    dateTo: undefined,
  });
  const addCommentLoading = useAppSelector(selectOrdersAddCommentLoading);

  useEffect(() => {
    void dispatch(fetchAllOrders());
  }, [dispatch]);

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const toggleCancelHandler = async (id: string) => {
    setLoadingCancel(true);
    try {
      const { data: response } = await axiosApi.patch<string>(`/orders/toggleCancel/${id}`);
      dispatch(toggleCancelOrder(response));
      setRestoreToggleCanceled(false);
      setLoadingCancel(false);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        const error = e.response.data as IOrderError;
        void messageApi.error({ content: error.error[language] }, 4);
        orders.filter((item) => {
          if (item._id === id) {
            setOrderState(item);
            return;
          }
        });
        setRestoreToggleCanceled(true);
        setIsModalOpen(true);
      }
      console.log(e);
      setLoadingCancel(false);
    }
  };

  const openNotificationHandler = (placement: NotificationPlacement, status: string) => {
    switch (status) {
      case '0':
        api.success({
          message: translation.smsSent,
          description: '',
          placement,
        });
        break;
      case '4':
        api.error({
          message: translation.outOfMoney,
          description: '',
          placement,
        });
        break;
      default:
        api.error({
          message: translation.smsNotSent,
          description: '',
          placement,
        });
    }
  };

  const submitFormHandler = async (finalObj: { order: { comment: string; id: string } }) => {
    await dispatch(addComment(finalObj));
  };

  const onFinish = (values: { comment: string }) => {
    const finalObj = {
      order: {
        comment: values.comment,
        id: selectedOrder,
      },
    };
    void submitFormHandler(finalObj);
    setSelectedOrder('');
    form.setFieldValue('comment', '');
  };

  const onRangePickerChange: RangePickerProps['onChange'] = (dates) => {
    if (dates) {
      const datesLocal = dates.map((date) => date?.add(6, 'hours') ?? undefined);
      setDatesToFilter({ dateFrom: datesLocal[0], dateTo: datesLocal[1] });
    } else {
      setDatesToFilter({ dateFrom: undefined, dateTo: undefined });
    }
  };

  const handleFilterByDates = (
    setSelectedKeys: (keys: React.Key[]) => void,
    confirm: () => void,
  ) => {
    setSelectedKeys(['orderDate']);
    confirm();
  };

  const handleReset = (clearFilters: () => void, close: () => void) => {
    clearFilters();
    setDatesToFilter({ dateFrom: undefined, dateTo: undefined });
    close();
  };

  const handleCommentsFormOpenChange = () => {
    setSelectedOrder('');
    form.setFieldValue('comment', '');
  };

  const handleSendMessage = async (order: IOrderFromDb) => {
    const xmlRequest = createXMLRequest({
      yurt: order.yurt.title,
      clientPhone: order.client.clientPhone,
      clientName: order.client.clientName,
      orderDate: order.orderDate,
      prepaid: order.prepaid,
      totalPrice: order.totalPrice,
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
      openNotificationHandler('bottomRight', status);
    }
  };

  const commentForm = (
    <Form form={form} name='commentForm' autoComplete='off' onFinish={onFinish}>
      <Form.Item name='comment' rules={[{ required: true, message: translation.enterComment }]}>
        <Input placeholder={translation.comment} />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          block
          loading={addCommentLoading}
          disabled={addCommentLoading}
        >
          {translation.send}
        </Button>
      </Form.Item>
    </Form>
  );

  const columns: TableProps<IOrderFromDb>['columns'] = [
    {
      title: translation.yurt,
      dataIndex: 'yurt',
      key: 'yurt',
      render: (_, record) => (
        <TableYurt>
          <Avatar src={`${API_URL}/${record.yurt.image}`} size='large'>
            {record.yurt.title.split(' ')[0]}
          </Avatar>
          <span>{record.yurt.title}</span>
        </TableYurt>
      ),
      sorter: (record, recordNext) => {
        const yurt = record.yurt.title;
        const yurtNext = recordNext.yurt.title;
        if (yurt < yurtNext) return -1;
        if (yurt > yurtNext) return 1;
        return 0;
      },
    },
    {
      title: translation.date,
      dataIndex: 'orderDate',
      key: 'orderDate',
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters, close }) => {
        return (
          <CustomFlex vertical align='end' gap='8px' onKeyDown={(e) => e.stopPropagation()}>
            <RangeDatePicker
              onChange={onRangePickerChange}
              value={[datesToFilter.dateFrom, datesToFilter.dateTo]}
            />
            <Space>
              <Button type='link' onClick={() => clearFilters && handleReset(clearFilters, close)}>
                {translation.clear}
              </Button>
              <Button type='primary' onClick={() => handleFilterByDates(setSelectedKeys, confirm)}>
                {translation.apply}
              </Button>
            </Space>
          </CustomFlex>
        );
      },
      onFilter: (_, record) => {
        const { dateFrom, dateTo } = datesToFilter;
        if (!(dateFrom && dateTo)) return true;
        return (
          record.orderDate >= dayjs(dateFrom).toISOString() &&
          record.orderDate <= dayjs(dateTo).toISOString()
        );
      },
      render: (_, record) => {
        const currentYear = Number(new Date().toISOString().slice(0, 4));
        const orderYear = Number(record.orderDate.toString().slice(0, 4));
        return (
          <CenteringBox>
            {dayjs(record.orderDate).format(
              `dd, D MMM${currentYear === orderYear ? '' : ', YYYY'}`,
            )}
          </CenteringBox>
        );
      },
      sorter: (record, recordNext) => {
        const date = record.orderDate;
        const dateNext = recordNext.orderDate;
        if (date < dateNext) return -1;
        if (date > dateNext) return 1;
        return 0;
      },
    },
    {
      title: translation.name,
      dataIndex: 'client',
      key: 'client',
      render: (_, record) => <CenteringBox>{record.client.clientName}</CenteringBox>,
    },
    {
      title: translation.phoneNumber,
      dataIndex: 'client',
      key: 'client',
      render: (_, record) => <CenteringBox>{record.client.clientPhone}</CenteringBox>,
    },
    {
      title: translation.service,
      dataIndex: 'services',
      key: 'services',
      render: (records: IServiceWithBookingPrice[]) => {
        const services = records.map((record) => (
          <li key={nanoid()}>
            {record.serviceTitle} - {record.serviceBookingPrice} c.
          </li>
        ));
        const content = <NumberedList>{services}</NumberedList>;
        return (
          services.length > 0 && (
            <Popover content={content} trigger='hover'>
              <Button type='link'>{translation.look}</Button>
            </Popover>
          )
        );
      },
    },

    {
      title: translation.prepaidExpense,
      dataIndex: 'prepaid',
      key: 'prepaid',
      render: (prepaid: number) => <CenteringBox>{prepaid}</CenteringBox>,
    },
    {
      title: translation.toPay,
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (_, record) => {
        return <CenteringBox>{record.totalPrice - record.prepaid}</CenteringBox>;
      },
    },
    {
      title: translation.comments,
      dataIndex: 'commentaries',
      key: 'commentaries',
      render: (records: IComment[]) => {
        const content = (
          <CommentsList
            size='small'
            itemLayout='vertical'
            dataSource={records}
            renderItem={(_, index) => (
              <Item>
                <Username>{records[index].user.username}</Username>
                <CommentText>{records[index].text}</CommentText>
              </Item>
            )}
          />
        );
        return records ? (
          records.length > 0 && (
            <Popover content={content} trigger='hover'>
              <Button type='link'>{translation.look}</Button>
            </Popover>
          )
        ) : (
          <div></div>
        );
      },
    },
    {
      title: translation.designed,
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (_, record) => <>{record.createdBy.username}</>,
    },
    {
      title: translation.issueDate,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        const currentYear = Number(new Date().toISOString().slice(0, 4));
        const orderYear = Number(record.createdAt.slice(0, 4));
        return (
          <CenteringBox>
            {dayjs(record.createdAt).format(`D MMM${currentYear === orderYear ? '' : ', YYYY'}`)}
          </CenteringBox>
        );
      },
    },
    {
      title: translation.action,
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        const newDate = new Date();
        newDate.setUTCHours(0, 0, 0, 0);

        let date = false;
        if (newDate.toISOString() > record.orderDate) {
          date = true;
        }

        return (
          <Flex gap='small' wrap justify={'center'}>
            <Tooltip title={!isTouchScreen && translation.edit}>
              <Button
                disabled={
                  date ||
                  (user?.user.role === 'moderator' && record.createdBy._id !== user?.user._id)
                }
                type='default'
                icon={<EditOutlined />}
                onClick={() => {
                  setOrderState(record);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title={!isTouchScreen && translation.addComment}>
              <Popover
                content={commentForm}
                trigger='click'
                open={record._id === selectedOrder}
                onOpenChange={handleCommentsFormOpenChange}
              >
                <Button
                  disabled={
                    date ||
                    (user?.user.role === 'moderator' && record.createdBy._id !== user?.user._id)
                  }
                  type='default'
                  icon={<CommentOutlined />}
                  onClick={() => setSelectedOrder(record._id)}
                />
              </Popover>
            </Tooltip>
            <Tooltip title={!isTouchScreen && translation.sendMessage}>
              <Popconfirm
                title={translation.sendMessageConfirm}
                okText={translation.okText}
                cancelText={translation.noText}
                onConfirm={() => void handleSendMessage(record)}
              >
                <Button
                  disabled={
                    date ||
                    (user?.user.role === 'moderator' && record.createdBy._id !== user?.user._id)
                  }
                  loading={loadingCancel}
                  type='default'
                  icon={<MailOutlined />}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip
              title={!isTouchScreen && (record.canceled ? translation.resume : translation.cansel)}
            >
              <Popconfirm
                title={record.canceled ? translation.resumeThisOrder : translation.canselThisOrder}
                okText={translation.okText}
                cancelText={translation.noText}
                onConfirm={() => void toggleCancelHandler(record._id)}
              >
                <Button
                  disabled={
                    date ||
                    (user?.user.role === 'moderator' && record.createdBy._id !== user?.user._id)
                  }
                  loading={loadingCancel}
                  type='default'
                  danger={!record.canceled}
                  icon={<StopOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Flex>
        );
      },
    },
    {
      title: translation.status,
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: translation.inProgress,
          value: true,
        },
        {
          text: translation.canceled,
          value: false,
        },
        {
          text: translation.completed,
          value: 'completed',
        },
      ],
      onFilter: (value, record) => {
        const newDate = new Date();
        newDate.setUTCHours(0, 0, 0, 0);
        if (value === 'completed') {
          return !record.canceled && record.orderDate < newDate.toISOString();
        } else if (value) {
          return record.canceled !== value && record.orderDate > newDate.toISOString();
        } else {
          return record.canceled;
        }
      },
      render: (_, record) => {
        const newDate = new Date();
        newDate.setUTCHours(0, 0, 0, 0);

        let status = (
          <Tooltip title={translation.inProgress}>
            <FieldTimeOutlined />
          </Tooltip>
        );
        if (record.canceled) {
          status = (
            <Tooltip title={translation.canceled}>
              <CloseCircleOutlined />
            </Tooltip>
          );
        } else if (record.orderDate < newDate.toISOString()) {
          status = (
            <Tooltip title={translation.completed}>
              <CheckOutlined />
            </Tooltip>
          );
        }
        return <CenteringBox>{status}</CenteringBox>;
      },
    },
  ];

  return (
    <TableContainer>
      {contextHolder}
      {contextHolderNotification}
      <Title level={4}>{translation.listOrders}</Title>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ position: ['bottomCenter'], hideOnSinglePage: true, pageSize: 7 }}
        loading={loading}
        scroll={{ x: 1 }}
      />
      <OrderEditor
        onCansel={onCancel}
        orderStateToEdit={orderState}
        open={isModalOpen}
        isToggleCancelHandler={restoreToggleCanceled}
        toggleCancelFunction={(id) => void toggleCancelHandler(id)}
      />
    </TableContainer>
  );
};

export default Orders;

const Title = styled(Typography.Title)`
  margin: 2rem 0;
`;

const Item = styled(List.Item)`
  min-width: 150px;
  max-width: 300px;
`;

const Username = styled.span`
  font-weight: 500;
`;

const CommentText = styled.span`
  display: block;
  font-size: 1rem;
`;

const NumberedList = styled.ol`
  margin: 0;
  padding: 0 0 0 1rem;
`;

const TableYurt = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TableContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 1500px) {
    max-width: 1500px;
  }
`;

const CenteringBox = styled.div`
  display: flex;
  justify-content: center;
`;

const CustomFlex = styled(Flex)`
  padding: 8px;
`;

const RangeDatePicker = (props: RangePickerProps) => {
  const panelRender = (panelNode: React.ReactNode) => (
    <StyledWrapperRangePicker>{panelNode}</StyledWrapperRangePicker>
  );

  return <DatePicker.RangePicker panelRender={panelRender} {...props} />;
};

export const StyledWrapperRangePicker = styled.div`
  .ant-picker-panel {
    &:last-child {
      width: 0;

      .ant-picker-header {
        position: absolute;
        right: 0;

        .ant-picker-header-prev-btn,
        .ant-picker-header-view {
          visibility: hidden;
        }
      }

      .ant-picker-body {
        display: none;
      }

      @media (min-width: 768px) {
        width: 280px !important;
        .ant-picker-header {
          position: relative;

          .ant-picker-header-prev-btn,
          .ant-picker-header-view {
            visibility: initial;
          }
        }

        .ant-picker-body {
          display: block;
        }
      }
    }
  }
`;

const CommentsList = styled(List)`
  max-height: 300px;
  overflow-y: auto;
`;
