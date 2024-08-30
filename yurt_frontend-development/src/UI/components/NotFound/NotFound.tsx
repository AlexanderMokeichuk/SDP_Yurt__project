import React from 'react';
import { Result } from 'antd';
import { returnTranslation } from '~/languages';
import { useAppSelector } from '~/app/hooks';
import { selectLanguage } from '@users/usersSlice';

const NotFound: React.FC = () => {
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('NotFound', language);

  return <Result status='404' title='404' subTitle={translation.subTitle} />;
};

export default NotFound;
