import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectServiceList } from '@services/servicesSlice';
import { fetchAllServices } from '@services/servicesThunks';
import { Flex, Row, Switch, Typography } from 'antd';
import Container from '@container/Container';
import ServiceCard from '@services/components/ServiceCard';
import styled from 'styled-components';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

const Services: React.FC = () => {
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectServiceList);
  const [loadingId, setLoadingId] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Services', language);

  useEffect(() => {
    void dispatch(fetchAllServices());
  }, [dispatch]);

  useEffect(() => {
    if (services.filter((item) => item.blocked).length < 1) setShowBlocked(false);
  }, [services, showBlocked]);

  const toggleShowBlocked = (checked: boolean) => {
    setShowBlocked(checked);
  };

  return (
    <Container>
      {services.filter((item) => item.blocked).length > 0 && (
        <CustomFlex gap={5}>
          <Switch onChange={toggleShowBlocked} />
          <Typography.Text>{translation.showBlockedServices}</Typography.Text>
        </CustomFlex>
      )}
      <Row gutter={[16, 24]}>
        {services.map((item) => {
          return showBlocked
            ? item.blocked && (
                <ServiceCard
                  key={item._id}
                  service={item}
                  loadingId={loadingId}
                  setLoadingId={setLoadingId}
                />
              )
            : !item.blocked && (
                <ServiceCard
                  key={item._id}
                  service={item}
                  loadingId={loadingId}
                  setLoadingId={setLoadingId}
                />
              );
        })}
      </Row>
    </Container>
  );
};

export default Services;

const CustomFlex = styled(Flex)`
  margin-bottom: 20px;
`;
