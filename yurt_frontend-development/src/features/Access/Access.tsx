import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectLanguage, selectUser } from '@users/usersSlice';
import { selectUsersFetchLoading, selectUsersList } from '@access/accessSlice';
import { fetchUsers } from '@access/accessThunks';
import { Avatar, Button, List, Table, TableProps, Typography } from 'antd';
import styled from 'styled-components';
import { IUserFromDb } from '~/types/user';
import { API_URL } from '~/constants';
import DropDownActions from '@access/components/DropDownActions';
import ActionsBlockUser from '@access/components/ActionsBlockUser';
import NewUser from '@access/components/NewUser';
import { returnTranslation } from '~/languages';
import { StopOutlined } from '@ant-design/icons';

const Access: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUser);
  const users = useAppSelector(selectUsersList);
  const loading = useAppSelector(selectUsersFetchLoading);
  const language = useAppSelector(selectLanguage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translation = returnTranslation('Access', language);
  const user = useAppSelector(selectUser);
  const [loadingId, setLoadingId] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user?.user.role === 'moderator') {
      navigate('/');
      return;
    }
    void dispatch(fetchUsers());
  }, [user, navigate, userState, dispatch]);

  const columns: TableProps<IUserFromDb>['columns'] = [
    {
      title: translation.image,
      dataIndex: 'image',
      key: 'image',
      render: (_, record) =>
        record.blocked ? (
          <BlockedAvatar icon={<BlockedOutlined />} size='large' />
        ) : (
          <Avatar src={`${API_URL}/${record.image}`} gap={3} size='large'>
            {record.username.split(' ')[0]}
          </Avatar>
        ),
    },
    {
      title: translation.name,
      dataIndex: 'username',
      key: 'username',
      sorter: (record, recordNext) => {
        const nameA = record.username.toLowerCase();
        const nameB = recordNext.username.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      render: (_, record) =>
        record._id === userState?.user._id ? (
          <BlueText>{record.username}</BlueText>
        ) : (
          <Text disabled={record.blocked}>{record.username}</Text>
        ),
    },
    {
      title: translation.phoneNumber,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (_, record) => <Text disabled={record.blocked}>{record.phoneNumber}</Text>,
    },
    {
      title: translation.role,
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => {
        return record.role === 'owner' ? (
          <strong>{translation.owner}</strong>
        ) : (
          <DropDownActions
            item={record}
            textAdmin={translation.admin}
            textModer={translation.moder}
            blocked={record.blocked}
          />
        );
      },
    },
    {
      title: translation.action,
      key: 'action',
      render: (_, record) => {
        return record.role === 'owner' || record._id === userState?.user._id ? (
          <strong>{translation.access}</strong>
        ) : (
          <ActionsBlockUser
            id={record._id}
            blocked={record.blocked}
            textBlocked={translation.blocked}
            textUnlock={translation.unlock}
            loadingId={loadingId}
            setLoadingId={setLoadingId}
          />
        );
      },
    },
  ];

  return user?.user.role === 'moderator' ? (
    <Title>Недостаточно прав</Title>
  ) : (
    <TableContainer>
      <NewUser open={isModalOpen} onCancel={closeModal} />
      <Button type='primary' onClick={showModal}>
        {translation.addManager}
      </Button>
      <Title level={4}>{translation.listUsers}</Title>
      <BoxList>
        <List
          dataSource={users}
          loading={loading}
          renderItem={(user) => (
            <List.Item key={user._id}>
              <List.Item.Meta
                avatar={
                  user.blocked ? (
                    <BlockedAvatar icon={<BlockedOutlined />} />
                  ) : (
                    <Avatar src={`${API_URL}/${user.image}`} />
                  )
                }
                title={
                  user._id === userState?.user._id ? (
                    <BlueText>{user.username}</BlueText>
                  ) : (
                    <Text disabled={user.blocked}>{user.username}</Text>
                  )
                }
                description={
                  <>
                    <BoxContent>
                      {translation.phoneNumber}: {user.phoneNumber}
                    </BoxContent>
                    <BoxContent>
                      {translation.role}:{' '}
                      {user.role === 'owner' ? (
                        <strong>{translation.owner}</strong>
                      ) : (
                        <DropDownActions
                          item={user}
                          textAdmin={translation.admin}
                          textModer={translation.moder}
                          blocked={user.blocked}
                        />
                      )}
                    </BoxContent>
                    <BoxContent>
                      {translation.action}:{' '}
                      {user.role === 'owner' || user._id === userState?.user._id ? (
                        <strong>{translation.access}</strong>
                      ) : (
                        <ActionsBlockUser
                          id={user._id}
                          blocked={user.blocked}
                          textBlocked={translation.blocked}
                          textUnlock={translation.unlock}
                          loadingId={loadingId}
                          setLoadingId={setLoadingId}
                        />
                      )}
                    </BoxContent>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </BoxList>
      <BoxTable>
        <Table
          dataSource={users}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ position: ['bottomCenter'], hideOnSinglePage: true, pageSize: 7 }}
          loading={loading}
          scroll={{ x: 1 }}
        />
      </BoxTable>
    </TableContainer>
  );
};

export default Access;

const Title = styled(Typography.Title)`
  margin: 2rem 0;
`;

const { Text } = Typography;

const TableContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }

  @media (max-width: 805px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const BoxList = styled.div`
  display: none;
  width: 100%;
  @media (max-width: 805px) {
    display: block;
    width: 100%;
  }
`;

const BoxContent = styled.div`
  max-width: 225px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 805px) {
    margin-bottom: 10px;
  }
`;

const BoxTable = styled.div`
  @media (max-width: 805px) {
    display: none;
  }
`;

const BlueText = styled(Text)`
  color: #1677ff;
`;

const BlockedAvatar = styled(Avatar)`
  background-color: transparent;
`;

const BlockedOutlined = styled(StopOutlined)`
  color: #ddd;
`;
