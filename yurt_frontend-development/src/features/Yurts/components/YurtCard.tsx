import { Card, Modal, Popconfirm, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import noImage from '~/assets/no-image.svg';
import { API_URL } from '~/constants';
import Yurt from '@yurts/Yurt';
import { IYurtFromDb, IYurtMutation } from '~/types/yurt';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { toggleBlockYurt } from '@yurts/yurtsThunks';
import YurtEditor from './YurtEditor';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { selectLanguage, selectUser } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { selectYurtToggleBlockLoading } from '@yurts/yurtsSlice';
import { IDateOrder } from '~/types/order';
import axiosApi from '~/axiosApi';
import dayjs from 'dayjs';
import { Button } from 'antd/lib';

const { Text } = Typography;

interface Props {
  yurt: IYurtFromDb;
}

const YurtCard: React.FC<Props> = ({ yurt }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [modalShowYurt, setModalShowYurt] = useState(false);
  const [modalEditYurt, setModalEditYurt] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Yurts', language);
  const user = useAppSelector(selectUser);
  const toggleBlockLoading = useAppSelector(selectYurtToggleBlockLoading);
  const [unavailableDates, setUnavailableDates] = useState<IDateOrder[]>([]);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDeleteYurt = async () => {
    await dispatch(toggleBlockYurt(yurt._id));
  };

  const modalConfirmOk = () => {
    void handleDeleteYurt();
  };

  const openViewYurtModal = () => {
    setModalShowYurt(true);
  };

  const closeViewYurtModal = () => {
    setModalShowYurt(false);
  };

  const openEditYurtModal = () => {
    setModalEditYurt(true);
  };

  const closeEditYurtModal = () => {
    setModalEditYurt(false);
  };

  const confirm = async (id: string) => {
    if (yurt.blocked) {
      void handleDeleteYurt();
    } else {
      const { data: response } = await axiosApi.get<IDateOrder[]>(
        `/orders/orderDates/${id}?Id=yurt`,
      );
      setUnavailableDates(response);
      if (response.length) {
        showModal();
      } else {
        void handleDeleteYurt();
      }
    }
  };

  const yurtMutation = (yurt: IYurtFromDb): IYurtMutation => ({
    title: yurt.title,
    description: yurt.description,
    pricePerDay: yurt.pricePerDay.toString(),
    image: null,
  });

  return (
    <>
      <Modal
        onCancel={hideModal}
        title={
          <CustomTitle>
            <WarningOutlined /> {translation.blockedConfirm}
          </CustomTitle>
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
                <CustomText type={'warning'}>&quot;{item.yurt?.title}&quot;</CustomText>{' '}
                {translation.issued} <wbr />
                <CustomText mark>({dayjs(item.orderDate).format(`dd, D MMM, YYYY`)})</CustomText>
              </CustomText>
            </div>
          );
        })}
      </Modal>
      <CustomCard
        $blocked={yurt.blocked}
        hoverable
        cover={
          <ImageCardMedia
            $blocked={yurt.blocked}
            src={yurt.image ? `${API_URL}/${yurt.image}` : noImage}
            alt={yurt.title}
            onClick={openViewYurtModal}
          />
        }
        actions={
          user?.user.role !== 'moderator'
            ? [
                <EditOutlined key='edit' disabled={yurt.blocked} onClick={openEditYurtModal} />,
                <Popconfirm
                  key={yurt.blocked ? translation.unlock : translation.blocked}
                  title={yurt.blocked ? translation.unlockThisYurt : translation.blockedThisYurt}
                  description={
                    yurt.blocked ? translation.unlockConfirm : translation.blockedConfirm
                  }
                  onConfirm={() => void confirm(yurt._id)}
                  okText={translation.okText}
                  cancelText={translation.noText}
                  okButtonProps={{ loading: toggleBlockLoading, disabled: toggleBlockLoading }}
                >
                  {yurt.blocked ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </Popconfirm>,
              ]
            : []
        }
      >
        <Meta
          title={yurt.title}
          description={`${translation.from} ${yurt.pricePerDay} ${translation.pricePerDay}`}
        />
      </CustomCard>

      <Modal open={modalShowYurt} width={900} onCancel={closeViewYurtModal} footer={null}>
        <Yurt yurt={yurt} />
      </Modal>

      <Modal open={modalEditYurt} width={900} onCancel={closeEditYurtModal} footer={null}>
        <YurtEditor
          yurt={yurtMutation(yurt)}
          yurtId={yurt._id}
          closeModal={modalEditYurt}
          visibleModal={setModalEditYurt}
        />
      </Modal>
    </>
  );
};

export default YurtCard;

const { Meta } = Card;

const CustomCard = styled(Card)<{ $blocked: boolean }>`
  opacity: ${(props) => (props.$blocked ? 0.3 : 1)};
  border: ${(props) => (props.$blocked ? '1px solid #696969' : '')};
`;

const ImageCardMedia = styled.img<{ $blocked: boolean }>`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: ${(props) => (props.$blocked ? '1px solid #696969' : '')};
`;

const CustomTitle = styled.span`
  color: red;
`;

const CustomText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
`;
