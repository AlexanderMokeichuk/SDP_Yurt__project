import React, { useEffect, useState } from 'react';
import Container from '@container/Container';
import { selectClients } from '@clients/clientsSlice';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { getClients } from '@clients/clientsThunks';
import ClientCard from '@clients/components/ClientCard';
import styled from 'styled-components';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import { Flex, Switch, Typography } from 'antd';

const Clients: React.FC = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectClients);
  const [loadingId, setLoadingId] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Clients', language);

  useEffect(() => {
    void dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (clients.filter((item) => item.blocked).length < 1) setShowBlocked(false);
  }, [clients, showBlocked]);

  const toggleShowBlocked = (checked: boolean) => {
    setShowBlocked(checked);
  };

  return (
    <Container>
      {clients.filter((item) => item.blocked).length > 0 && (
        <CustomFlex gap={5}>
          <Switch onChange={toggleShowBlocked} />
          <Typography.Text>{translation.showBlockedClients}</Typography.Text>
        </CustomFlex>
      )}
      <Box>
        {clients.map((item) => {
          return showBlocked
            ? item.blocked && (
                <ClientCard
                  key={item._id}
                  client={item}
                  loadingId={loadingId}
                  setLoadingId={setLoadingId}
                />
              )
            : !item.blocked && (
                <ClientCard
                  key={item._id}
                  client={item}
                  loadingId={loadingId}
                  setLoadingId={setLoadingId}
                />
              );
        })}
      </Box>
    </Container>
  );
};

export default Clients;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CustomFlex = styled(Flex)`
  margin-bottom: 20px;
`;
