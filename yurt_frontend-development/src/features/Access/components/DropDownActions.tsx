import React from 'react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { IUserFromDb } from '~/types/user';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectUser } from '@users/usersSlice';
import { roleChange } from '@access/accessThunks';

interface Props {
  item: IUserFromDb;
  textAdmin: string;
  textModer: string;
  blocked: boolean;
}

const DropDownActions: React.FC<Props> = ({ item, textAdmin, textModer, blocked }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const changeRole = async () => {
    await dispatch(roleChange(item._id));
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <ButtonSelectRole onClick={() => void changeRole()} disabled={item.role === 'admin'}>
          <TitleRole>
            <CustomCheckOutlined
              style={item.role === 'admin' ? { display: 'inline-block' } : { display: 'none' }}
            />
            <TitleRole>{textAdmin}</TitleRole>
          </TitleRole>
        </ButtonSelectRole>
      ),
      key: '0',
    },
    {
      label: (
        <ButtonSelectRole onClick={() => void changeRole()} disabled={item.role === 'moderator'}>
          <TitleRole>
            <CustomCheckOutlined
              style={item.role === 'moderator' ? { display: 'inline-block' } : { display: 'none' }}
            />
            <TitleRole>{textModer}</TitleRole>
          </TitleRole>
        </ButtonSelectRole>
      ),
      key: '1',
    },
  ];

  let SelectRole = (
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <OpenDropDown disabled={blocked}>
            {item.role === 'admin' ? (
              <TitleRole $blocked={item.blocked}>{textAdmin}</TitleRole>
            ) : (
              <TitleRole $blocked={item.blocked}>{textModer}</TitleRole>
            )}
            <ArrowAntd />
          </OpenDropDown>
        </Space>
      </a>
    </Dropdown>
  );

  if (user) {
    if (user.user.role !== 'owner') {
      SelectRole =
        item.role === 'admin' ? (
          <TitleRole $blocked={item.blocked}>{textAdmin}</TitleRole>
        ) : (
          <TitleRole $blocked={item.blocked}>{textModer}</TitleRole>
        );
    }
  }

  return SelectRole;
};

export default DropDownActions;

const ButtonSelectRole = styled(Button)`
  width: 150px;
  display: flex;
  justify-content: start;
`;

const CustomCheckOutlined = styled(CheckOutlined)`
  margin-right: 10px;
`;
const OpenDropDown = styled(Button)`
  width: 150px;
  display: flex;
  justify-content: space-between;
`;

const TitleRole = styled.strong<{ $blocked?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.$blocked ? '#00000040;' : '#000000e0;')};
`;

const ArrowAntd = styled(DownOutlined)`
  font-size: 10px;
`;
