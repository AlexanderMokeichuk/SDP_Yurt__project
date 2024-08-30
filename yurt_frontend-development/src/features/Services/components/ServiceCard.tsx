import React, { useState } from 'react';
import { toggleBlockService } from '@services/servicesThunks';
import { Button, Col, Modal, Popconfirm, Typography } from 'antd';
import { IService, IServiceFromDb, IServiceMutation } from '~/types/service';
import { EditOutlined, WarningOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectLanguage, selectUser } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import styled from 'styled-components';
import ServiceEditor from './ServiceEditor';
import axiosApi from '~/axiosApi';
import { IDateOrder } from '~/types/order';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Props {
  service: IService;
  loadingId: string;
  setLoadingId: (id: string) => void;
}

const ServiceCard: React.FC<Props> = ({ service, loadingId, setLoadingId }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [modalEditService, setModalEditService] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Services', language);
  const [unavailableDates, setUnavailableDates] = useState<IDateOrder[]>([]);
  const user = useAppSelector(selectUser);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const modalConfirmOk = () => {
    void deleteServiceById();
  };

  const deleteServiceById = async () => {
    setLoadingId(service._id);
    await dispatch(toggleBlockService(service._id));
    setLoadingId('');
  };

  const confirm = async (id: string) => {
    if (service.blocked) {
      void deleteServiceById();
    } else {
      const { data: response } = await axiosApi.get<IDateOrder[]>(
        `/orders/orderDates/${id}?Id=service`,
      );
      setUnavailableDates(response);
      if (response.length) {
        showModal();
      } else {
        void deleteServiceById();
      }
    }
  };

  const openEditServiceModal = () => {
    setModalEditService(true);
  };

  const closeEditServiceModal = () => {
    setModalEditService(false);
  };

  const serviceMutation = (service: IServiceFromDb): IServiceMutation => ({
    title: service.title,
    price: service.price,
  });

  return (
    <>
      <Modal
        width={700}
        onCancel={hideModal}
        title={
          <CustomTitle>
            <WarningOutlined /> {translation.confirmBlock}
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
                {translation.orderWithService}
                <CustomText type={'warning'}>
                  &quot;{item.service?.serviceTitle}&quot;
                </CustomText>{' '}
                {translation.issued} <wbr />
                <CustomText mark>({dayjs(item.orderDate).format(`dd, D MMM, YYYY`)})</CustomText>
              </CustomText>
            </div>
          );
        })}
      </Modal>
      <CardCustom $blocked={service.blocked} xs={24} sm={24}>
        <CardBox>
          <TitleInf>{translation.service}</TitleInf>
          <TitleName>{service.title}</TitleName>
        </CardBox>
        <CardBox>
          <TitleInf>{translation.price}</TitleInf>
          <TitleName>{service.price}</TitleName>
        </CardBox>
        {user?.user.role !== 'moderator' && (
          <Buttons>
            <Button onClick={openEditServiceModal} disabled={service.blocked}>
              <EditOutlined />
              {translation.edit}
            </Button>
            <Popconfirm
              title={service.blocked ? translation.unblockService : translation.blockService}
              description={service.blocked ? translation.confirmUnblock : translation.confirmBlock}
              onConfirm={() => void confirm(service._id)}
              okText={translation.okText}
              cancelText={translation.noText}
            >
              <Button
                danger
                loading={service._id === loadingId}
                disabled={service._id === loadingId}
              >
                {!service.blocked ? translation.block : translation.unblock}
              </Button>
            </Popconfirm>
          </Buttons>
        )}
      </CardCustom>
      <Modal open={modalEditService} onCancel={closeEditServiceModal} footer={null}>
        <ServiceEditor
          service={serviceMutation(service)}
          serviceId={service._id}
          closeModal={modalEditService}
          visibleModal={setModalEditService}
        />
      </Modal>
    </>
  );
};

export default ServiceCard;

const CardCustom = styled(Col)<{ $blocked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 90px;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  opacity: ${(props) => (props.$blocked ? 0.3 : 1)};
  border: ${(props) => (props.$blocked ? '1px solid #696969' : '')};

  -webkit-box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);
  -moz-box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);
  box-shadow: 0 2px 8px 5px rgba(34, 60, 80, 0.12);

  @media (max-width: 575px) {
    flex-direction: column;
    gap: 8px;
    align-items: inherit;
  }
`;

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 30%;

  @media (max-width: 575px) {
    width: 100%;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 575px) {
    align-self: end;
  }
`;

const TitleInf = styled.span`
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #8c8c8c;

  @media (max-width: 575px) {
    font-size: 16px;
  }
`;

const TitleName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #595959;
`;

const CustomTitle = styled.span`
  color: red;
`;

const CustomText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
`;
