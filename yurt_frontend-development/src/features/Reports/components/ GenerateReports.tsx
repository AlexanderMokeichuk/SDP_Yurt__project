import React, { useState } from 'react';
import { Button, DatePicker, Flex, Form, FormProps, GetProps } from 'antd';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { IDates, IDatesRequest } from '~/types/report';
import dayjs from 'dayjs';
import { selectReportLoading, selectReports } from '@reports/reportsSlice';
import { requestReports } from '@reports/reportsThunks';
import ExcelExportComponent from '@reports/components/ExelExportComponent';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';
import styled from 'styled-components';

const GenerateReports: React.FC = () => {
  const dispatch = useAppDispatch();
  const ordersForReport = useAppSelector(selectReports);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [form] = Form.useForm<IDates>();
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Reports', language);
  const loading = useAppSelector(selectReportLoading);
  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const submitFormHandler = async (values: IDates) => {
    const finalObj: IDatesRequest = {
      dateFrom: dayjs(values.dateFrom).add(6, 'hours').toISOString(),
      dateTo: dayjs(values.dateTo).add(6, 'hours').toISOString(),
    };

    setDateTo(dayjs(values.dateTo).format('DD.MM.YYYY'));
    setDateFrom(dayjs(values.dateFrom).format('DD.MM.YYYY'));

    await dispatch(requestReports(finalObj));
  };

  const onFinish: FormProps<IDates>['onFinish'] = (values) => {
    void submitFormHandler(values);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <CustomFlex justify='end'>
          <Form.Item
            name='dateFrom'
            label={translation.from}
            rules={[{ required: true, message: translation.selectDate }]}
          >
            <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            name='dateTo'
            label={translation.before}
            rules={[{ required: true, message: translation.selectDate }]}
          >
            <DatePicker
              format={'YYYY-MM-DD'}
              style={{ width: '100%' }}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} disabled={loading}>
            {translation.createReports}
          </Button>
        </CustomFlex>
      </Form>
      {ordersForReport && (
        <ExcelExportComponent data={ordersForReport} period={`${dateFrom} - ${dateTo}`} />
      )}
    </>
  );
};

const CustomFlex = styled(Flex)`
  gap: 30px;
  @media screen and (max-width: 520px) {
    align-items: start;
    flex-direction: column;
    gap: 0px;
    margin-bottom: 10px;
  }
`;

export default GenerateReports;
