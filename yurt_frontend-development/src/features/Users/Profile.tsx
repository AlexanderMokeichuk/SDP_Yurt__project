import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Flex, Form, FormProps, Image, Input, message } from 'antd';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectLanguage, selectUser, selectUserEditLoading } from '@users/usersSlice';
import { API_URL } from '~/constants';
import noImage from '~/assets/no-image.svg';
import EditProfile from '@users/components/EditProfile';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { changePassword, deleteAvatar } from './usersThunks';
import { INewPassword } from '~/types/user';
import { returnTranslation } from '~/languages';
import ForgotPasswordNew from '@users/components/ForgotPasswordNew';

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [form] = Form.useForm();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Users', language);
  const changePasswordLoading = useAppSelector(selectUserEditLoading);
  const deleteAvatarLoading = useAppSelector(selectUserEditLoading);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalChangePassword = () => {
    setModalChangePassword(true);
  };

  const closeModalChangePassword = () => {
    setModalChangePassword(false);
  };

  let jobTitle = translation.moder;
  switch (user?.user.role) {
    case 'admin':
      jobTitle = translation.admin;
      break;
    case 'owner':
      jobTitle = translation.owner;
      break;
  }

  const onChangePassword = async (values: INewPassword) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      ).unwrap();
      await message.success(translation.passwordChanged);
      form.resetFields();
    } catch (e) {
      console.log(e);
      await message.error(translation.failedChangePassword);
    }
  };

  const onFinish: FormProps<INewPassword>['onFinish'] = (values) => {
    void onChangePassword(values);
    form.resetFields();
  };

  const handleDeleteAvatar = async () => {
    await dispatch(deleteAvatar());
  };

  return (
    <Main>
      <Container>
        <EditProfile open={isModalOpen} onCancel={closeModal} />
        <HeaderBox>
          <div>
            <ProfileTitle>{translation.profile}</ProfileTitle>
            <ProfileText>{translation.manageYourData}</ProfileText>
          </div>
          <EditButton type='primary' onClick={showModal}>
            <EditButtonIcon />
          </EditButton>
        </HeaderBox>
        <Box>
          <InfoTitle>{translation.imageProfile}</InfoTitle>
          <CustomCardPhoto>
            <DivBlue />
            <BoxForImage>
              <PhotoProfile
                width={150}
                height={150}
                src={user?.user.image ? `${API_URL}/${user.user.image}` : noImage}
                alt={user?.user.username}
                preview={Boolean(user?.user.image)}
              />
              {user?.user.image && (
                <DeleteAvatarButton
                  onClick={() => {
                    void handleDeleteAvatar();
                  }}
                  shape='circle'
                  icon={<DeleteOutlined />}
                  loading={deleteAvatarLoading}
                  disabled={deleteAvatarLoading}
                />
              )}
            </BoxForImage>
          </CustomCardPhoto>
          <PhotoBoxMobile>
            <PhotoProfile
              width={100}
              height={100}
              src={user?.user.image ? `${API_URL}/${user.user.image}` : noImage}
              alt={user?.user.username}
              preview={Boolean(user?.user.image)}
            />
            {user?.user.image && (
              <DeleteAvatarButton
                onClick={() => {
                  void handleDeleteAvatar();
                }}
                shape='circle'
                icon={<DeleteOutlined />}
                loading={deleteAvatarLoading}
                disabled={deleteAvatarLoading}
              />
            )}
          </PhotoBoxMobile>
        </Box>
        <Box>
          <InfoTitle>{translation.infoProfile}</InfoTitle>
          <CardInfo>
            <BoxInCardInf>
              <TitleInf>{translation.name}</TitleInf>
              <TitleName>{user?.user.username}</TitleName>
            </BoxInCardInf>
            <BoxInCardInf>
              <TitleInf>{translation.jobTitle}</TitleInf>
              <TitleName>{jobTitle}</TitleName>
            </BoxInCardInf>
          </CardInfo>
        </Box>
        <Box>
          <InfoTitle>{translation.contactData}</InfoTitle>
          <CardInfo>
            <BoxInCardInf>
              <TitleInf>{translation.phoneNumber}</TitleInf>
              <TitleName>{user?.user.phoneNumber}</TitleName>
            </BoxInCardInf>
          </CardInfo>
        </Box>
        <Box>
          <InfoTitle>{translation.changePassword}</InfoTitle>
          <CardInfo>
            <BoxInCardInf>
              <Form form={form} name='changePasswordForm' onFinish={onFinish} layout='vertical'>
                <Form.Item
                  label={translation.nowPassword}
                  name='currentPassword'
                  rules={[{ required: true, message: translation.enterPassword }]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={translation.newPassword}
                  name='newPassword'
                  rules={[
                    { required: true, message: translation.enterNewPassword },
                    { min: 6, message: translation.minLength },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={translation.confirmNewPassword}
                  name='confirmPassword'
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: translation.confirmNewPassword },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(translation.errorPassword);
                      },
                    }),
                  ]}
                >
                  <Input.Password size='large' autoComplete='new-password' />
                </Form.Item>
                <Flex justify='space-between' align='baseline'>
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={changePasswordLoading}
                      disabled={changePasswordLoading}
                    >
                      {translation.changePassword}
                    </Button>
                  </Form.Item>
                  <ForgotPasswordLink href='#' onClick={openModalChangePassword}>
                    {translation.forgotPassword}
                  </ForgotPasswordLink>
                </Flex>
                <ForgotPasswordNew
                  closeModal={modalChangePassword}
                  visibleModal={closeModalChangePassword}
                />
              </Form>
            </BoxInCardInf>
          </CardInfo>
        </Box>
      </Container>
    </Main>
  );
};

export default Profile;

const Main = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
  width: 700px;
`;

const ProfileTitle = styled.span`
  display: block;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;

  @media (max-width: 670px) {
    font-size: 16px;
    font-weight: 600;
  }
`;

const ForgotPasswordLink = styled.a`
  font-size: 12px;
`;

const ProfileText = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: gray;

  @media (max-width: 670px) {
    font-size: 12px;
    font-weight: 400;
  }
`;

const EditButton = styled(Button)`
  @media (max-width: 670px) {
    padding: 0 10px;
    margin: 0;
  }
  @media (max-width: 370px) {
    padding: 0 10px;
  }
`;

const EditButtonIcon = styled(EditOutlined)`
  @media (max-width: 670px) {
    font-size: 10px;
  }
  @media (max-width: 370px) {
    font-size: 10px;
  }
`;

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Box = styled.div`
  @media (max-width: 370px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const CustomCardPhoto = styled.div`
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  height: 270px;
  display: none;
  @media (min-width: 650px) {
    display: block;
  }
`;

const DivBlue = styled.div`
  width: 100%;
  height: 50%;
  background: #69b1ff;
`;

const BoxForImage = styled.div`
  position: absolute;
  bottom: 60px;
  left: 20px;
`;

const PhotoProfile = styled(Image)`
  border: 2px solid white;
  border-radius: 50%;
`;

const PhotoBoxMobile = styled.div`
  padding-top: 10px;
  @media (min-width: 650px) {
    display: none;
  }
  position: relative;
  max-width: 100px;
`;

const InfoTitle = styled.span`
  font-size: 18px;
  display: block;
  margin-bottom: 10px;

  @media (max-width: 670px) {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const CardInfo = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 670px) {
    border: none;
    gap: 15px;
    padding: 10px;
    border-radius: 8px;
  }
`;

const BoxInCardInf = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-bottom: 1px solid #d9d9d9;
`;

const TitleInf = styled.span`
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #8c8c8c;

  @media (max-width: 670px) {
    font-weight: 400;
  }
`;

const TitleName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 700;
  padding: 15px;
  color: #595959;

  @media (max-width: 670px) {
    font-weight: 500;
    padding: 0;
  }
`;

const DeleteAvatarButton = styled(Button)`
  position: absolute;
  right: 0;
`;
