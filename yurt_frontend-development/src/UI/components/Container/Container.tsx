import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <CustomContainer>{children}</CustomContainer>;
};

export default Container;

export const CustomContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 576px) {
    max-width: 576px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 992px) {
    max-width: 992px;
  }

  @media (min-width: 1200px) {
    max-width: 1200px;
  }
`;
