import React from 'react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { changeLanguage, selectLanguage, selectUser } from '@users/usersSlice';
import { useLocation } from 'react-router-dom';
import { IRegisterResponse } from '~/types/user';

interface Location {
  pathname: string;
}

const ComponentChangeLanguage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const language = useAppSelector(selectLanguage);
  const user = useAppSelector(selectUser);

  const items: MenuProps['items'] = [
    {
      label: (
        <Button onClick={() => dispatch(changeLanguage())} disabled={language === 'ru'}>
          <TitleRole>
            <TitleRole>RU</TitleRole>
          </TitleRole>
        </Button>
      ),
      key: '0',
    },
    {
      label: (
        <Button onClick={() => dispatch(changeLanguage())} disabled={language === 'kg'}>
          <TitleRole>
            <TitleRole>KG</TitleRole>
          </TitleRole>
        </Button>
      ),
      key: '1',
    },
  ];

  return (
    <ChangeLanguage $location={location} $user={user} menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <OpenDropDown>
            {language.toUpperCase()}
            <DownOutlined />
          </OpenDropDown>
        </Space>
      </a>
    </ChangeLanguage>
  );
};

export default ComponentChangeLanguage;

const ChangeLanguage = styled(Dropdown)<{ $location: Location; $user: IRegisterResponse | null }>`
  position: absolute;
  top: ${(props) =>
    props.$location.pathname === '/login' || (props.$location.pathname === '/' && !props.$user)
      ? '20px'
      : '-10px'};
  right: 20px;
`;

const OpenDropDown = styled(Button)`
  display: flex;
  justify-content: space-between;
`;

const TitleRole = styled.strong`
  font-size: 12px;
`;
