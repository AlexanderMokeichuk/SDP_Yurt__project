import React, { useState, useRef } from 'react';
import { Button, Input, Row, Col } from 'antd';
import styled from 'styled-components';
import { useAppSelector } from '~/app/hooks';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

const FileInput: React.FC<Props> = ({ onChange, name, label }) => {
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('FileInput', language);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.files?.[0]?.name ?? '';
    setFileName(fileName);
    onChange(e);
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type='file'
        name={name}
        onChange={onFileChange}
        ref={inputRef}
        accept='image/*'
      />
      <Row gutter={16} align='middle'>
        <Col flex='auto'>
          <Input disabled placeholder={label} value={fileName} />
        </Col>
        <Col>
          <AddButton type='primary' onClick={activateInput}>
            {translation.addButton}
          </AddButton>
        </Col>
      </Row>
    </>
  );
};

export default FileInput;

const AddButton = styled(Button)`
  margin-top: 5px;
`;
