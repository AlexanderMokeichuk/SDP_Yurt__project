import Container from '@container/Container';
import React, { useEffect, useState } from 'react';
import { Col, Flex, Row, Spin, Switch, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectAllYurts, selectYurtsFetchLoading } from '@yurts/yurtsSlice';
import { fetchAllYurts } from '@yurts/yurtsThunks';
import YurtCard from '@yurts/components/YurtCard';
import styled from 'styled-components';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

const Yurts: React.FC = () => {
  const dispatch = useAppDispatch();
  const yurts = useAppSelector(selectAllYurts);
  const isLoading = useAppSelector(selectYurtsFetchLoading);
  const [showBlocked, setShowBlocked] = useState(false);
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Yurts', language);

  useEffect(() => {
    void dispatch(fetchAllYurts());
  }, [dispatch]);

  useEffect(() => {
    if (yurts.filter((yurt) => yurt.blocked).length < 1) setShowBlocked(false);
  }, [yurts, showBlocked]);

  const toggleShowBlocked = (checked: boolean) => {
    setShowBlocked(checked);
  };

  return (
    <Container>
      {yurts.filter((yurt) => yurt.blocked).length > 0 && (
        <CustomFlex gap={5}>
          <Switch onChange={toggleShowBlocked} />
          <Typography.Text style={{ marginLeft: 10 }}>
            {translation.showBlockedYurts}
          </Typography.Text>
        </CustomFlex>
      )}
      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]}>
          {yurts.map((yurt) => {
            return showBlocked
              ? yurt.blocked && (
                  <Col key={yurt._id} xs={24} sm={12} md={8} lg={8}>
                    <YurtCard yurt={yurt} />
                  </Col>
                )
              : !yurt.blocked && (
                  <Col key={yurt._id} xs={24} sm={12} md={8} lg={8}>
                    <YurtCard yurt={yurt} />
                  </Col>
                );
          })}
        </Row>
      </Spin>
    </Container>
  );
};

export default Yurts;

const CustomFlex = styled(Flex)`
  margin-bottom: 40px;
`;
