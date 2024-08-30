import React, { PropsWithChildren, useState } from 'react';
import {
  CheckCircleOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  UnorderedListOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Modal, notification, type NotificationArgsProps } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { selectLanguage, selectLoginLoading, selectUser } from '@users/usersSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { logout } from '@users/usersThunks';
import YurtEditor from '@yurts/components/YurtEditor';
import Login from '@users/Login';
import ServiceEditor from '@services/components/ServiceEditor';
import { ItemType } from 'antd/lib/menu/interface';
import OrderEditor from '@orders/components/OrderEditor';
import { returnTranslation } from '~/languages';
import ComponentChangeLanguage from '@customLayout/components/ComponentChangeLanguage';

type NotificationPlacement = NotificationArgsProps['placement'];

const CustomLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const [api, contextHolderNotification] = notification.useNotification();
  const language = useAppSelector(selectLanguage);
  const logoutLoading = useAppSelector(selectLoginLoading);
  const [collapsed, setCollapsed] = useState(true);
  const [modalAddOrderVisible, setModalAddOrderVisible] = useState(false);
  const [modalAddYurtVisible, setModalAddYurtVisible] = useState(false);
  const [modalAddServiceVisible, setModalAddServiceVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const translation = returnTranslation('CustomLayout', language);

  const onCansel = () => {
    setModalAddOrderVisible(false);
  };

  const openAddYurtModal = () => {
    setModalAddYurtVisible(true);
  };

  const closeAddYurtModal = () => {
    setModalAddYurtVisible(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    await dispatch(logout());
    setOpen(false);
    navigate('/login');
  };

  const handleCancel = () => {
    setOpen(false);
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

  const mobileMenuItems: ItemType[] = [
    {
      key: 'add-yurt',
      icon: <HomeOutlined />,
      label: translation.addYurt,
      onClick: openAddYurtModal,
      hidden: user?.user.role === 'moderator',
    },
    {
      key: 'add-order',
      icon: <FileTextOutlined />,
      label: translation.addOrder,
      onClick: () => setModalAddOrderVisible(true),
    },
    {
      key: 'add-service',
      icon: <CheckCircleOutlined />,
      label: translation.addService,
      onClick: () => setModalAddServiceVisible(true),
      hidden: user?.user.role === 'moderator',
    },
  ].filter((item) => !item.hidden);

  const menuItems: ItemType[] = [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to={'/profile'}>{translation.profile}</Link>,
    },
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to={'/'}>{translation.yurts}</Link>,
    },
    {
      key: '/services',
      icon: <RightOutlined />,
      label: <Link to={'/services'}>{translation.services}</Link>,
    },
    {
      key: '/users',
      icon: <LockOutlined />,
      label: <Link to={'/users'}>{translation.access}</Link>,
      style: user?.user.role === 'moderator' ? { display: 'none' } : undefined,
    },
    {
      key: '/orders',
      icon: <UnorderedListOutlined />,
      label: <Link to={'/orders'}>{translation.orders}</Link>,
    },
    {
      key: '/reports',
      icon: <DatabaseOutlined />,
      label: <Link to={'/reports'}>{translation.reports}</Link>,
    },
    {
      key: '/clients',
      icon: <UsergroupDeleteOutlined />,
      label: <Link to={'/clients'}>{translation.clients}</Link>,
    },
    {
      key: '/logout',
      icon: <LogoutOutlined />,
      label: <span>{translation.logout}</span>,
      onClick: () => showModal(),
    },
  ];

  return (
    <LayoutCustom>
      {user && location.pathname !== '/login' ? (
        <>
          {contextHolderNotification}
          <Modal
            title={translation.logout}
            open={open}
            onOk={() => void handleOk()}
            onCancel={handleCancel}
            okText={translation.okText}
            cancelText={translation.noText}
            confirmLoading={logoutLoading}
            okButtonProps={{ disabled: logoutLoading }}
          >
            <p>{translation.modalConfirm}</p>
          </Modal>
          <ToolBar>
            <CustomSider trigger={null} collapsible collapsed={collapsed}>
              <Menu
                theme='dark'
                mode='inline'
                defaultSelectedKeys={[location.pathname]}
                items={menuItems}
              />
            </CustomSider>
          </ToolBar>
          <Layout>
            <HeaderCustom>
              <ComponentChangeLanguage />
              <ButtonMenu
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <CustomMenu
                theme='dark'
                mode='horizontal'
                defaultSelectedKeys={[location.pathname]}
                items={[
                  {
                    key: '/profile',
                    icon: <UserOutlined />,
                    label: <Link to={'/profile'}>{translation.profile}</Link>,
                  },
                  {
                    key: '/',
                    icon: <HomeOutlined />,
                    label: <Link to={'/'}>{translation.yurts}</Link>,
                  },
                  {
                    key: '/services',
                    icon: <RightOutlined />,
                    label: <Link to={'/services'}>{translation.services}</Link>,
                  },
                  {
                    key: '/users',
                    icon: <LockOutlined />,
                    label: <Link to={'/users'}>{translation.access}</Link>,
                    style: user?.user.role === 'moderator' ? { display: 'none' } : undefined,
                  },
                  {
                    key: '/orders',
                    icon: <UnorderedListOutlined />,
                    label: <Link to={'/orders'}>{translation.orders}</Link>,
                  },
                  {
                    key: '/reports',
                    icon: <DatabaseOutlined />,
                    label: <Link to={'/reports'}>{translation.reports}</Link>,
                  },
                  {
                    key: '/clients',
                    icon: <UsergroupDeleteOutlined />,
                    label: <Link to={'/clients'}>{translation.clients}</Link>,
                  },
                  ...mobileMenuItems,
                  {
                    key: '/logout',
                    icon: <LogoutOutlined />,
                    label: <span>{translation.logout}</span>,
                    onClick: () => showModal(),
                  },
                ]}
              />
              <HeaderButtonBlock>
                <ButtonOrder onClick={() => setModalAddOrderVisible(true)} type='primary'>
                  {translation.addOrder}
                </ButtonOrder>
                {user.user.role !== 'moderator' && (
                  <>
                    <Button onClick={() => setModalAddServiceVisible(true)} type='primary'>
                      {translation.addService}
                    </Button>
                    <ButtonAddYurt onClick={openAddYurtModal} type='primary'>
                      {translation.addYurt}
                    </ButtonAddYurt>
                  </>
                )}
              </HeaderButtonBlock>
            </HeaderCustom>
            <ContentCustom>{children}</ContentCustom>
          </Layout>
          <Modal open={modalAddYurtVisible} onCancel={closeAddYurtModal} footer={null}>
            <YurtEditor closeModal={modalAddYurtVisible} visibleModal={setModalAddYurtVisible} />
          </Modal>
          <Modal
            open={modalAddServiceVisible}
            onCancel={() => setModalAddServiceVisible(false)}
            footer={null}
          >
            <ServiceEditor
              closeModal={modalAddServiceVisible}
              visibleModal={setModalAddServiceVisible}
              serviceId={''}
            />
          </Modal>
          {modalAddOrderVisible && (
            <Modal open={modalAddOrderVisible} onCancel={onCansel} footer={null}>
              <OrderEditor
                onCansel={onCansel}
                open={modalAddOrderVisible}
                openNotification={(placement, status) =>
                  void openNotificationHandler(placement, status)
                }
              />
            </Modal>
          )}
        </>
      ) : (
        <>
          <ComponentChangeLanguage />
          <Login />
        </>
      )}
    </LayoutCustom>
  );
};

const { Header, Content } = Layout;

export default CustomLayout;

const LayoutCustom = styled(Layout)`
  min-height: 100vh;
  position: relative;
`;

const ToolBar = styled.div`
  @media (max-width: 670px) {
    display: none;
  }
`;

const CustomSider = styled(Layout.Sider)`
  height: 100%;
`;

const HeaderCustom = styled(Header)`
  margin-top: 40px;
  width: 100%;
  padding: 2px;
  background: #fff;
  display: flex;
  align-items: center;

  @media (max-width: 670px) {
    justify-content: space-between;
  }
`;

const CustomMenu = styled(Menu)`
  display: flex;
  justify-content: center;
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  font-size: 10px;

  @media (min-width: 670px) {
    display: none;
  }
`;

const ButtonMenu = styled(Button)`
  font-size: 16px;
  width: 64px;
  height: 64px;

  @media (max-width: 670px) {
    display: none;
  }
`;

const ButtonAddYurt = styled(Button)`
  margin-left: 10px;
`;

const ButtonOrder = styled(Button)`
  margin-right: 10px;
`;

const HeaderButtonBlock = styled.div`
  margin-right: 10px;
  margin-left: auto;
  display: flex;
  align-items: center;

  @media (max-width: 670px) {
    display: none;
  }
`;

const ContentCustom = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  @media (max-width: 430px) {
    margin: 12px 8px;
    padding: 10px;
  }
`;
