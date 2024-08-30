import { customAlphabet } from 'nanoid';
import { IOrderForSMS } from '~/types/order';
import dayjs from 'dayjs';

const createXMLRequest = (data: IOrderForSMS) => {
  const nanoid = customAlphabet('1234567890abcdef', 12);
  const smsId = nanoid(12);

  const sms = `Салам ${data.clientName}! Сиз ${data.yurt} ${dayjs(data.orderDate).format(`dd, D MMM, YYYY`)} үчүн ээлеп койдуңуз, депозит: ${data.prepaid} сом, баланс: ${data.totalPrice - data.prepaid} сом\n\nЗдравствуйте, ${data.clientName}! Вы забронировали ${data.yurt} на ${dayjs(data.orderDate).format(`dd, D MMM, YYYY`)}, задаток: ${data.prepaid} сом, остаток: ${data.totalPrice - data.prepaid} сом`;

  return {
    xml: `
    <message>
      <login>login</login>
      <pwd>password</pwd>
      <id>${smsId}</id>
      <sender>SMSPRO.KG</sender>
      <text>${sms}</text>
      <time></time>
      <phones>
        <phone>${data.clientPhone}</phone>
      </phones>
    </message>
  `,
    transactionId: smsId,
    clientPhone: data.clientPhone,
  };
};

export default createXMLRequest;
