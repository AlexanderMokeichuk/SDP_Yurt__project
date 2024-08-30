import React from 'react';
import { API_URL } from '~/constants';
import styled from 'styled-components';
import { Card, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import noImage from '~/assets/no-image.svg';
import Container from '@container/Container';
import { IYurtFromDb } from '~/types/yurt';
import { useAppSelector } from '~/app/hooks';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

interface Props {
  yurt: IYurtFromDb;
}

const Yurt: React.FC<Props> = ({ yurt }) => {
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Yurts', language);

  return (
    <Container>
      <Box>
        <Card
          hoverable
          cover={
            <ImageCardMedia
              src={yurt.image ? `${API_URL}/${yurt.image}` : noImage}
              alt={yurt.title}
            />
          }
        >
          <Meta
            title={yurt.title}
            description={`${translation.from} ${yurt.pricePerDay} ${translation.pricePerDay}`}
          />
          <BoxInfo>
            <Title level={5}>{yurt.description ? translation.titleDescription : ''}</Title>
            {yurt.description}
          </BoxInfo>
        </Card>
      </Box>
    </Container>
  );
};

export default Yurt;

const Box = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
`;

const ImageCardMedia = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
`;

const BoxInfo = styled.div`
  margin-top: 10px;
`;
const Title = styled(Typography.Title)`
  margin-top: 10px;
`;
