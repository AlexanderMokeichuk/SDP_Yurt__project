import React from 'react';
import GenerateReports from '~/features/Reports/components/ GenerateReports';
import { Button, List, Popover, Table, TableProps, Tooltip } from 'antd';
import { IComment } from '~/types/order';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import { useAppSelector } from '~/app/hooks';
import { selectReports } from '@reports/reportsSlice';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { IServiceWithBookingPrice } from '~/types/service';
import { IReportFromDb } from '~/types/report';
import { CloseCircleOutlined } from '@ant-design/icons';

const Reports: React.FC = () => {
  const reports = useAppSelector(selectReports);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Reports', language);

  const columns: TableProps<IReportFromDb>['columns'] = [
    {
      title: translation.orderDate,
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (_, record) => {
        return <>{dayjs(record.orderDate).format('DD.MM.YYYY')}</>;
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
      title: translation.comments,
      dataIndex: 'commentaries',
      key: 'commentaries',
      render: (records: IComment[]) => {
        const content = (
          <List
            size='small'
            itemLayout='vertical'
            dataSource={records}
            renderItem={(comment) => (
              <Item>
                <Username>{comment.user.username}</Username>
                <CommentText>{comment.text}</CommentText>
              </Item>
            )}
          ></List>
        );
        return (
          records.length > 0 && (
            <Popover content={content} trigger='hover'>
              <Button type='link'>{translation.look}</Button>
            </Popover>
          )
        );
      },
    },
    {
      title: translation.yurt,
      dataIndex: 'yurt',
      key: 'yurt',
      render: (_, record) => (
        <TableYurt>
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
      title: translation.clientName,
      dataIndex: 'client',
      key: 'client',
      render: (_, record) => <>{record.client.clientName}</>,
    },
    {
      title: translation.clientPhoneNumber,
      dataIndex: 'client',
      key: 'client',
      render: (_, record) => <>{record.client.clientPhone}</>,
    },
    {
      title: translation.services,
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
      title: translation.prepaid,
      dataIndex: 'prepaid',
      key: 'prepaid',
      render: (prepaid: number) => <>{prepaid}</>,
    },
    {
      title: translation.yurtPrice,
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (_, record) => {
        return <>{record.yurtPrice}</>;
      },
    },
    {
      title: translation.priceServices,
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (_, record) => {
        const priceForServices = record.services.reduce((acc, srv) => {
          return acc + Number(srv.serviceBookingPrice);
        }, 0);

        return <>{priceForServices}</>;
      },
    },
    {
      title: translation.toPay,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        return <>{record.totalPrice}</>;
      },
    },
    {
      title: 'Отменен',
      dataIndex: 'canceled',
      key: 'canceled',
      render: (_, record) => {
        return (
          <>
            {record.canceled ? (
              <CenteringBox>
                <Tooltip title={translation.canceled}>
                  <CloseCircleOutlined />
                </Tooltip>
              </CenteringBox>
            ) : undefined}
          </>
        );
      },
    },
  ];

  return (
    <>
      <TableContainer>
        <GenerateReports />
        <Table
          dataSource={reports ? reports : undefined}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ position: ['bottomCenter'], hideOnSinglePage: true, pageSize: 7 }}
          scroll={{ x: 1 }}
        />
      </TableContainer>
    </>
  );
};

export default Reports;

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

  @media (min-width: 1700px) {
    max-width: 1700px;
  }
`;

const CenteringBox = styled.div`
  display: flex;
  justify-content: center;
`;
