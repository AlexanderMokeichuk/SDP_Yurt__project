import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { IOrderFromDb } from '~/types/order';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { CloudDownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppSelector } from '~/app/hooks';
import { selectLanguage } from '@users/usersSlice';
import { returnTranslation } from '~/languages';

interface Props {
  data: IOrderFromDb[];
  period: string;
}

const ExcelExportComponent: React.FC<Props> = ({ data, period }) => {
  const language = useAppSelector(selectLanguage);
  const translation = returnTranslation('Reports', language);

  const formattedData = data.map((order) => ({
    [translation.orderDate]: `${dayjs(order.orderDate).format('DD.MM.YYYY')}`,
    [translation.comments]: `${order.commentaries.map((comment) => `${comment.user.username} - ${comment.text}`).join('\n')}`,
    [translation.yurt]: `${order.yurt.title}`,
    [translation.clientName]: `${order.client.clientName}`,
    [translation.clientPhoneNumber]: `${order.client.clientPhone}`,
    [translation.services]: order.services
      .map(
        (service, index) =>
          `${index + 1}. ${service.serviceTitle} - ${service.serviceBookingPrice} сом`,
      )
      .join('\n'),
    [translation.prepaid]: `${order.prepaid}`,
    [translation.yurtPrice]: `${order.yurtPrice} `,
    [translation.priceServices]: order.servicesBookingPrice,
    [translation.toPay]: order.totalPrice,
    cancelled: order.canceled,
  }));

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow([
      translation.orderDate,
      translation.comments,
      translation.yurt,
      translation.clientName,
      translation.clientPhoneNumber,
      translation.services,
      translation.prepaid,
      translation.yurtPrice,
      translation.priceServices,
      translation.toPay,
    ]).font = { bold: true };

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5CC' },
      };
      cell.font = { bold: true, color: { argb: '000000' } };
    });

    formattedData.forEach((item) => {
      const row = worksheet.addRow([
        item[translation.orderDate],
        item[translation.comments],
        item[translation.yurt],
        item[translation.clientName],
        item[translation.clientPhoneNumber],
        item[translation.services],
        item[translation.prepaid],
        item[translation.yurtPrice],
        item[translation.priceServices],
        item[translation.toPay],
      ]);

      if (item.cancelled) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' },
          };
        });
      }
    });

    worksheet.columns = [
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${translation.reportsPeriod} (${period}).xlsx`);
  };

  return (
    <Box>
      <SaveButton onClick={() => void exportToExcel()}>
        {translation.download}
        <CustomIcon />
      </SaveButton>
    </Box>
  );
};

export default ExcelExportComponent;

const Box = styled.div`
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }
`;

const SaveButton = styled(Button)`
  margin: 10px 0;
`;

const CustomIcon = styled(CloudDownloadOutlined)`
  font-size: 20px;
`;
