import React from 'react';
import { useAppDispatch } from '~/app/hooks';
import { blockUserId } from '@access/accessThunks';
import { Button } from 'antd';

interface Props {
  id: string;
  blocked: boolean;
  textBlocked: string;
  textUnlock: string;
  loadingId: string;
  setLoadingId: (id: string) => void;
}

const ActionsBlockUser: React.FC<Props> = ({
  id,
  blocked,
  textBlocked,
  textUnlock,
  loadingId,
  setLoadingId,
}) => {
  const dispatch = useAppDispatch();

  const blockUser = async () => {
    setLoadingId(id);
    await dispatch(blockUserId(id));
    setLoadingId('');
  };

  return (
    <Button
      danger={!blocked}
      onClick={() => void blockUser()}
      loading={id === loadingId}
      disabled={id === loadingId}
    >
      {blocked ? textUnlock : textBlocked}
    </Button>
  );
};

export default ActionsBlockUser;
