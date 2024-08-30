import React, { useState } from 'react';
import { Button, Modal, Popconfirm, Typography } from 'antd';
import styled from 'styled-components';
import { IClientFromDb } from '~/types/client';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { toggleBlockClient } from '@clients/clientsThunks';
import { selectLanguage, selectUser } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosApi from '~/axiosApi';
import { IDateOrder } from '~/types/order';

interface Props {
  client: IClientFromDb;
  loadingId: string;
  setLoadingId: (id: string) => void;
}

const ClientCard: React.FC<Props> = ({ client, loadingId, setLoadingId }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Clients', language);
  const [unavailableDates, setUnavailableDates] = useState<IDateOrder[]>([]);
  const user = useAppSelector(selectUser);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const modalConfirmOk = () => {
    void LockSwitch();
  };

  const LockSwitch = async () => {
    setLoadingId(client._id);
    await dispatch(toggleBlockClient(client._id));
    setLoadingId('');
  };

  const confirm = async (id: string) => {
    if (client.blocked) {
      void LockSwitch();
    } else {
      const { data: response } = await axiosApi.get<IDateOrder[]>(
        `/orders/orderDates/${id}?Id=client`,
      );
      setUnavailableDates(response);
      if (response.length) {
        showModal();
      } else {
        void LockSwitch();
      }
    }
  };

  return (
    <>
      <Modal
        onCancel={hideModal}
        title={
          <Warning>
            <WarningOutlined /> {translation.blockClientConfirm}
          </Warning>
        }
        open={open}
        footer={[
          <Button key='cancelText' onClick={hideModal}>
            {translation.noText}
          </Button>,
          <Button key='onOk' danger onClick={modalConfirmOk}>
            {translation.okText}
          </Button>,
        ]}
      >
        {unavailableDates.map((item) => {
          return (
            <div key={item._id}>
              <CustomText>
                {translation.issued}
                <CustomText mark>({dayjs(item.orderDate).format(`dd, D MMM, YYYY`)})</CustomText>
              </CustomText>
            </div>
          );
        })}
      </Modal>

      <CardCustom $blocked={client.blocked}>
        {client.blocked && (
          <BlockedBlock>
            <CustomText type='danger'>{translation.blocked}</CustomText>
          </BlockedBlock>
        )}
        <Box>
          <CardBox>
            <TitleHeader>{translation.name}</TitleHeader>
            <CustomTitle>{client.clientName}</CustomTitle>
          </CardBox>
          <CardBox>
            <TitleHeader>{translation.phoneNumber}</TitleHeader>
            <CustomTitle>{client.clientPhone}</CustomTitle>
          </CardBox>
        </Box>
        {user?.user.role !== 'moderator' && (
          <Buttons>
            <CustomPopconfirm
              title={client.blocked ? translation.unlockClient : translation.blockClient}
              description={
                client.blocked ? translation.unlockClientConfirm : translation.blockClientConfirm
              }
              onConfirm={() => void confirm(client._id)}
              okText={translation.okText}
              cancelText={translation.noText}
            >
              <Button
                danger={!client.blocked}
                loading={client._id === loadingId}
                disabled={client._id === loadingId}
              >
                {client.blocked ? translation.unlock : translation.block}
              </Button>
            </CustomPopconfirm>
          </Buttons>
        )}
      </CardCustom>
    </>
  );
};

export default ClientCard;

const CardCustom = styled.div<{ $blocked: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  position: relative;

  min-height: 90px;
  padding: 10px;
  border: ${(props) => (props.$blocked ? '1px solid #DC143C' : '1px solid #fff')};
  border-radius: 5px;

  @media (max-width: 375px) {
    flex-direction: column;
    gap: 10px;
  }

  -webkit-box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);
  -moz-box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);
  box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);
`;

const BlockedBlock = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const CustomText = styled(Typography.Text)`
  font-weight: 600;
  padding: 3px 10px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Buttons = styled.div`
  align-self: end;
`;

const CustomPopconfirm = styled(Popconfirm)`
  display: flex;
  margin-top: auto;
`;

const TitleHeader = styled.span`
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #8c8c8c;
`;

const CustomTitle = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #595959;
`;

const Warning = styled.span`
  color: red;
  font-size: 16px;
  font-weight: 700;
`;
