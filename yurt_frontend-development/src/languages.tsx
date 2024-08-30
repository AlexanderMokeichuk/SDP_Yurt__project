import { IFeatureTranslation, TLanguage } from '~/types/language';

const allLanguages: IFeatureTranslation[] = [
  {
    name: 'Access',
    data: [
      {
        name: 'enterPhoneForManager',
        translation: {
          ru: 'Пожалуйста, введите номер менеджера.',
          kg: 'Сураныч, менеджердин номерин киргизиңиз',
        },
      },
      {
        name: 'phoneNumber',
        translation: {
          ru: 'Номер',
          kg: 'Сан',
        },
      },
      {
        name: 'enterPassword',
        translation: {
          ru: 'Пожалуйста, введите пароль для менеджера.',
          kg: 'Сураныч, башкаруучунун сырсөзүн киргизиңиз.',
        },
      },
      {
        name: 'password',
        translation: {
          ru: 'Пароль',
          kg: 'Купуя сөз',
        },
      },
      {
        name: 'enterNameManager',
        translation: {
          ru: 'Пожалуйста, введите имя менеджера.',
          kg: 'Сураныч, менеджердин атын киргизиңиз.',
        },
      },
      {
        name: 'enterUserName',
        translation: {
          ru: 'Пожалуйста, введите имя менеджера.',
          kg: 'Сураныч, менеджердин атын киргизиңиз.',
        },
      },
      {
        name: 'addManager',
        translation: {
          ru: 'Добавить менеджера',
          kg: 'Башкаруучу кошуу',
        },
      },
      {
        name: 'listUsers',
        translation: {
          ru: 'Список пользователей',
          kg: 'Колдонуучулардын тизмеси',
        },
      },
      {
        name: 'phoneNumber',
        translation: {
          ru: 'Номер телефона',
          kg: 'Телефон номери',
        },
      },
      {
        name: 'owner',
        translation: {
          ru: 'Владелец',
          kg: 'Ээси',
        },
      },
      {
        name: 'action',
        translation: {
          ru: 'Действие',
          kg: 'Иш-аракет',
        },
      },
      {
        name: 'access',
        translation: {
          ru: 'Запрещено',
          kg: 'Тыюу салынган',
        },
      },
      {
        name: 'blocked',
        translation: {
          ru: 'Заблокировать',
          kg: 'Блоктоо',
        },
      },
      {
        name: 'unlock',
        translation: {
          ru: 'Разблокировать',
          kg: 'Кулпусун ачуу',
        },
      },
      {
        name: 'admin',
        translation: {
          ru: 'Администратор',
          kg: 'Администратор',
        },
      },
      {
        name: 'moder',
        translation: {
          ru: 'Менеджер',
          kg: 'Менеджер',
        },
      },
      {
        name: 'newManager',
        translation: {
          ru: 'Новый менеджер',
          kg: 'Жаңы менеджер',
        },
      },
      {
        name: 'add',
        translation: {
          ru: 'Добавить',
          kg: 'Кошуу',
        },
      },
      {
        name: 'chooseImage',
        translation: {
          ru: 'Выбрать изображение',
          kg: 'Тандоо сүрөт',
        },
      },
      {
        name: 'interName',
        translation: {
          ru: 'Пожалуйста, введите имя менеджера.',
          kg: 'Сураныч, менеджердин атын киргизиңиз',
        },
      },
      {
        name: 'interPhone',
        translation: {
          ru: 'Пожалуйста, введите номер менеджера.',
          kg: 'Сураныч, менеджердин номерин киргизиңиз',
        },
      },
      {
        name: 'image',
        translation: {
          ru: 'Фото',
          kg: 'Сүрөт',
        },
      },
      {
        name: 'name',
        translation: {
          ru: 'Имя',
          kg: 'Аты',
        },
      },
      {
        name: 'role',
        translation: {
          ru: 'Роль',
          kg: 'Рол',
        },
      },
      {
        name: 'showErrorMessage',
        translation: {
          ru: 'Пожалуйста, введите номер в правильном формате.',
          kg: 'Номерди туура форматта киргизиңиз.',
        },
      },
      {
        name: 'selectImage',
        translation: {
          ru: 'Выбрать изображение',
          kg: 'Сүрөттү тандаңыз',
        },
      },
      {
        name: 'addButton',
        translation: {
          ru: 'Добавить',
          kg: 'Кошуу',
        },
      },
    ],
  },
  {
    name: 'Clients',
    data: [
      {
        name: 'issued',
        translation: {
          ru: 'На данного клиента формлен заказ',
          kg: 'Бул кардар үчүн буйрутма берилди',
        },
      },
      {
        name: 'block',
        translation: {
          ru: 'Заблокировать',
          kg: 'Блоктоо',
        },
      },
      {
        name: 'blocked',
        translation: {
          ru: 'Заблокирован',
          kg: 'Бөгөттөлгөн',
        },
      },
      {
        name: 'unlock',
        translation: {
          ru: 'Разблокировать',
          kg: 'Кулпусун ачуу',
        },
      },
      {
        name: 'name',
        translation: {
          ru: 'Имя',
          kg: 'Аты',
        },
      },
      {
        name: 'phoneNumber',
        translation: {
          ru: 'Номер телефона',
          kg: 'Телефон номуру',
        },
      },
      {
        name: 'unlockClient',
        translation: {
          ru: 'Разблокировать клиента',
          kg: 'Кардарды бөгөттөн чыгаруу',
        },
      },
      {
        name: 'blockClient',
        translation: {
          ru: 'Заблокировать клиента',
          kg: 'Блок кардар',
        },
      },
      {
        name: 'okText',
        translation: {
          ru: 'Да',
          kg: 'Ооба',
        },
      },
      {
        name: 'noText',
        translation: {
          ru: 'Нет',
          kg: 'Жок',
        },
      },
      {
        name: 'unlockClientConfirm',
        translation: {
          ru: 'Вы уверены что хотите разблокировать клиента?',
          kg: 'Сиз чын эле кардарды бөгөттөн чыгаргыңыз келеби?',
        },
      },
      {
        name: 'blockClientConfirm',
        translation: {
          ru: 'Вы уверены что хотите заблокировать клиента?',
          kg: 'Кардарды чын эле бөгөттөгүңүз келеби?',
        },
      },
      {
        name: 'showBlockedClients',
        translation: {
          ru: 'Показать заблокированных клиентов',
          kg: 'Бөгөттөлгөн клиенттерди көрсөтүү',
        },
      },
    ],
  },
  {
    name: 'Orders',
    data: [
      {
        name: 'smsNotSent',
        translation: {
          ru: 'Сообщение клиенту о заказе не отправлено!',
          kg: `Буйрутма тууралуу кардарга билдирүү жөнөтүлгөн эмес!`,
        },
      },
      {
        name: 'smsSent',
        translation: {
          ru: 'Сообщение клиенту о заказе отправлено!',
          kg: `Заказ тууралуу кардарга билдирүү жөнөтүлдү!`,
        },
      },
      {
        name: 'outOfMoney',
        translation: {
          ru: (
            <>
              Сообщение клиенту о заказе не отправлено, так как у вас недостаточно средств в сервисе{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>
              .
            </>
          ),
          kg: (
            <>
              Заказ жөнүндө кардарга билдирүү жөнөтүлгөн жок, анткени сизде{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>{' '}
              кызматында акчаңыз жетишсиз.
            </>
          ),
        },
      },
      {
        name: 'sendMessage',
        translation: {
          ru: 'Отправить смс клиенту',
          kg: 'Кардарга SMS жөнөтүү',
        },
      },
      {
        name: 'sendMessageConfirm',
        translation: {
          ru: 'Вы уверены что хотите отправить платное смс клиенту?',
          kg: 'Кардарга акы төлөнүүчү SMS жөнөткүңүз келеби?',
        },
      },
      {
        name: 'messageApiNumber',
        translation: {
          ru: 'Пожалуйста, введите номер в правильном формате.',
          kg: 'Номерди туура форматта киргизиңиз.',
        },
      },
      {
        name: 'messageApiBlocked',
        translation: {
          ru: 'Выбранный вами клиент заблокирован администрацией Usonbak!!!',
          kg: 'Сиз тандаган кардар Усонбак администрациясы тарабынан блоктолгон!!!',
        },
      },
      {
        name: 'prepaid',
        translation: {
          ru: 'Предоплата превышает стоимость всех услуг и стоимость юрты',
          kg: 'Алдын ала төлөм бардык кызматтардын наркынан жана боз үйдүн баасынан ашат',
        },
      },
      {
        name: 'currency',
        translation: {
          ru: 'Сом',
          kg: 'Сом',
        },
      },
      {
        name: 'thisYurtDateBlocked',
        translation: {
          ru: 'Эта юрта уже забронирована на',
          kg: 'Бул боз үй мурунтан эле брондолгон',
        },
      },
      {
        name: 'edit',
        translation: {
          ru: 'Редактировать',
          kg: 'Түзөтүү',
        },
      },
      {
        name: 'order',
        translation: {
          ru: 'заказ',
          kg: 'тартип',
        },
      },
      {
        name: 'design',
        translation: {
          ru: 'Оформить',
          kg: 'Оформить',
        },
      },
      {
        name: 'selectDate',
        translation: {
          ru: 'Пожалуйста, выберите юрту.',
          kg: 'Сураныч, боз үй тандаңыз.',
        },
      },
      {
        name: 'yurt',
        translation: {
          ru: 'Юрта',
          kg: 'Боз үй',
        },
      },
      {
        name: 'selectClientNumber',
        translation: {
          ru: 'Пожалуйста, введите номер клиента.',
          kg: 'Кардар номериңизди киргизиңиз.',
        },
      },
      {
        name: 'phoneNumber',
        translation: {
          ru: 'Телефон',
          kg: 'Телефон',
        },
      },
      {
        name: 'client',
        translation: {
          ru: 'Клиент',
          kg: 'Кардар',
        },
      },
      {
        name: 'enterClientName',
        translation: {
          ru: 'Пожалуйста, введите имя клиента.',
          kg: 'Кардардын атын киргизиңиз.',
        },
      },
      {
        name: 'additionally',
        translation: {
          ru: 'Дополнительно',
          kg: 'Кошумча',
        },
      },
      {
        name: 'prepaidCode',
        translation: {
          ru: 'Предоплата, KGS',
          kg: 'Алдын ала төлөм, сом',
        },
      },
      {
        name: 'currency',
        translation: {
          ru: 'Сом',
          kg: 'Сом',
        },
      },
      {
        name: 'selectDate',
        translation: {
          ru: 'Выберите дату!',
          kg: 'Күн тандаңыз!',
        },
      },
      {
        name: 'comment',
        translation: {
          ru: 'Комментарий',
          kg: 'Комментарий',
        },
      },
      {
        name: 'service',
        translation: {
          ru: 'Услуга',
          kg: 'Кызмат',
        },
      },
      {
        name: 'addService',
        translation: {
          ru: 'Добавить услугу',
          kg: 'Кызмат кошуу',
        },
      },
      {
        name: 'save',
        translation: {
          ru: 'Сохранить',
          kg: 'Сактоо',
        },
      },
      {
        name: 'enterComment',
        translation: {
          ru: 'Введите комментарий',
          kg: 'Комментарий жазыңыз',
        },
      },
      {
        name: 'send',
        translation: {
          ru: 'Отправить',
          kg: 'Жөнөтүү',
        },
      },
      {
        name: 'date',
        translation: {
          ru: 'Дата',
          kg: 'Дата',
        },
      },
      {
        name: 'clear',
        translation: {
          ru: 'Очистить',
          kg: 'Таза',
        },
      },
      {
        name: 'apply',
        translation: {
          ru: 'Применить',
          kg: 'Колдонуу',
        },
      },
      {
        name: 'name',
        translation: {
          ru: 'Имя',
          kg: 'Аты',
        },
      },
      {
        name: 'look',
        translation: {
          ru: 'Посмотреть',
          kg: 'Кара',
        },
      },
      {
        name: 'prepaidExpense',
        translation: {
          ru: 'Аванс',
          kg: 'Аванса',
        },
      },
      {
        name: 'toPay',
        translation: {
          ru: 'К оплате',
          kg: 'Төлөөгө',
        },
      },
      {
        name: 'comments',
        translation: {
          ru: 'Комментарии',
          kg: 'Комментарийлер',
        },
      },
      {
        name: 'designed',
        translation: {
          ru: 'Оформил',
          kg: 'Иштелип чыккан',
        },
      },
      {
        name: 'issueDate',
        translation: {
          ru: 'Дата оформления',
          kg: 'Чыгарылган күнү',
        },
      },
      {
        name: 'action',
        translation: {
          ru: 'Действие',
          kg: 'Иш-аракет',
        },
      },
      {
        name: 'edit',
        translation: {
          ru: 'Редактировать',
          kg: 'Түзөтүү',
        },
      },
      {
        name: 'addComment',
        translation: {
          ru: 'Добавить комментарий',
          kg: 'Комментарий кошуу',
        },
      },
      {
        name: 'resume',
        translation: {
          ru: 'Возобновить',
          kg: 'Чыгарылган күнү',
        },
      },
      {
        name: 'cansel',
        translation: {
          ru: 'Отменить',
          kg: 'Жокко чыгаруу',
        },
      },
      {
        name: 'resumeThisOrder',
        translation: {
          ru: 'Возобновить этот заказ?',
          kg: 'Бул буйрукту жаңыртасызбы?',
        },
      },
      {
        name: 'canselThisOrder',
        translation: {
          ru: 'Отменить этот заказ?',
          kg: 'Бул буйрутма жокко чыгарылсынбы?',
        },
      },
      {
        name: 'okText',
        translation: {
          ru: 'Да',
          kg: 'Ооба',
        },
      },
      {
        name: 'noText',
        translation: {
          ru: 'Нет',
          kg: 'Жок',
        },
      },
      {
        name: 'status',
        translation: {
          ru: 'Статус',
          kg: 'Статус',
        },
      },
      {
        name: 'inProgress',
        translation: {
          ru: 'В работе',
          kg: 'Жумушта',
        },
      },
      {
        name: 'canceled',
        translation: {
          ru: 'Отменен',
          kg: 'Жокко чыгарылды',
        },
      },
      {
        name: 'completed',
        translation: {
          ru: 'Выполнен',
          kg: 'Аякталды',
        },
      },
      {
        name: 'listOrders',
        translation: {
          ru: 'Список заказов',
          kg: 'Заказ тизмеси',
        },
      },
    ],
  },
  {
    name: 'Reports',
    data: [
      {
        name: 'canceled',
        translation: {
          ru: 'Отменен',
          kg: 'Жокко чыгарылды',
        },
      },
      {
        name: 'selectDate',
        translation: {
          ru: 'Выберите дату!',
          kg: 'Күн тандаңыз!',
        },
      },
      {
        name: 'from',
        translation: {
          ru: 'От',
          kg: 'Тартып',
        },
      },
      {
        name: 'before',
        translation: {
          ru: 'До',
          kg: 'Мурда',
        },
      },
      {
        name: 'createReports',
        translation: {
          ru: 'Сформировать отчет',
          kg: 'Отчет түзүү',
        },
      },
      {
        name: 'orderDate',
        translation: {
          ru: 'Дата заказа',
          kg: 'буйрук датасы',
        },
      },
      {
        name: 'comments',
        translation: {
          ru: 'Комментарии',
          kg: 'Комментарийлер',
        },
      },
      {
        name: 'yurt',
        translation: {
          ru: 'Юрта',
          kg: 'Боз үй',
        },
      },
      {
        name: 'clientName',
        translation: {
          ru: 'Имя клиента',
          kg: 'Кардардын аты',
        },
      },
      {
        name: 'clientPhoneNumber',
        translation: {
          ru: 'Номер телефона клиента',
          kg: 'Кардардын телефон номери',
        },
      },
      {
        name: 'services',
        translation: {
          ru: 'Услуги',
          kg: 'Кызматтар',
        },
      },
      {
        name: 'prepaid',
        translation: {
          ru: 'Предоплата',
          kg: 'Алдын ала төлөө',
        },
      },
      {
        name: 'yurtPrice',
        translation: {
          ru: 'Цена за юрту',
          kg: 'Бир боз үйдүн баасы',
        },
      },
      {
        name: 'priceServices',
        translation: {
          ru: 'Цена за услуги',
          kg: 'Кызматтардын баасы',
        },
      },
      {
        name: 'toPay',
        translation: {
          ru: 'Итого',
          kg: 'Бардыгы',
        },
      },
      {
        name: 'reportsPeriod',
        translation: {
          ru: 'Отчет за период',
          kg: 'Мезгил үчүн отчет',
        },
      },
      {
        name: 'download',
        translation: {
          ru: 'Скачать отчет',
          kg: 'Отчетту жүктөп алыңыз',
        },
      },
      {
        name: 'look',
        translation: {
          ru: 'Посмотреть',
          kg: 'Кара',
        },
      },
      {
        name: 'download',
        translation: {
          ru: 'Скачать отчет',
          kg: 'Отчетту жүктөп алыңыз',
        },
      },
    ],
  },
  {
    name: 'Services',
    data: [
      {
        name: 'issued',
        translation: {
          ru: 'оформлен на',
          kg: 'күнү чыгарылган',
        },
      },
      {
        name: 'orderWithService',
        translation: {
          ru: 'Заказ с услугой',
          kg: 'Кызмат менен заказ кылуу',
        },
      },
      {
        name: 'service',
        translation: {
          ru: 'Услуга',
          kg: 'Кызмат',
        },
      },
      {
        name: 'price',
        translation: {
          ru: 'Цена',
          kg: 'Баасы',
        },
      },
      {
        name: 'blockService',
        translation: {
          ru: 'Заблокировать услугу',
          kg: 'Кызматты бөгөттөө',
        },
      },
      {
        name: 'unblockService',
        translation: {
          ru: 'Разблокировать услугу',
          kg: 'Кызматты бөгөттөн чыгаруу',
        },
      },
      {
        name: 'confirmUnblock',
        translation: {
          ru: 'Вы уверены что хотите разблокировать эту услугу?',
          kg: 'Бул кызматты чын эле бөгөттөн чыгаргыңыз келеби?',
        },
      },
      {
        name: 'confirmBlock',
        translation: {
          ru: 'Вы уверены что хотите заблокировать эту услугу?',
          kg: 'Бул кызматты чын эле бөгөттөгүңүз келеби?',
        },
      },
      {
        name: 'okText',
        translation: {
          ru: 'Да',
          kg: 'Ооба',
        },
      },
      {
        name: 'noText',
        translation: {
          ru: 'Нет',
          kg: 'Жок',
        },
      },
      {
        name: 'block',
        translation: {
          ru: 'Заблокировать',
          kg: 'Блоктоо',
        },
      },
      {
        name: 'unblock',
        translation: {
          ru: 'Разблокировать',
          kg: 'Кулпусун ачуу',
        },
      },
      {
        name: 'editService',
        translation: {
          ru: 'Редактировать услугу',
          kg: 'Кызматты түзөтүү',
        },
      },
      {
        name: 'newService',
        translation: {
          ru: 'Новая услуга',
          kg: 'Жаңы кызмат',
        },
      },
      {
        name: 'enterAboutService',
        translation: {
          ru: 'Пожалуйста, введите описание услуги.',
          kg: 'Кызматтын сүрөттөмөсүн киргизиңиз.',
        },
      },
      {
        name: 'about',
        translation: {
          ru: 'Описание',
          kg: 'Сүрөттөмө',
        },
      },
      {
        name: 'enterPriceService',
        translation: {
          ru: 'Пожалуйста, введите цену за услугу.',
          kg: 'Кызматтын баасын киргизиңиз.',
        },
      },
      {
        name: 'aboutPrice',
        translation: {
          ru: 'Цена, KGS',
          kg: 'Баасы, сом',
        },
      },
      {
        name: 'currency',
        translation: {
          ru: 'сом',
          kg: 'сом',
        },
      },
      {
        name: 'addService',
        translation: {
          ru: 'Добавить',
          kg: 'Кошуу',
        },
      },
      {
        name: 'changeService',
        translation: {
          ru: 'Сохранить',
          kg: 'Сактоо',
        },
      },
      {
        name: 'showBlockedServices',
        translation: {
          ru: 'Показать неактивные услуги',
          kg: 'Жигерсиз кызматтарды көрсөтүү',
        },
      },
    ],
  },
  {
    name: 'Users',
    data: [
      {
        name: 'name',
        translation: {
          ru: 'Имя',
          kg: 'Аты',
        },
      },
      {
        name: 'failedChangePassword',
        translation: {
          ru: 'Не получилось изменить пароль!',
          kg: 'Сырсөз өзгөртүлбөй калды!',
        },
      },
      {
        name: 'outOfMoney',
        translation: {
          ru: (
            <>
              Отпрака сообщений не доступна, необходимо пополнить баланс на сайте{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>
              .
            </>
          ),
          kg: (
            <>
              Билдирүүлөрдү жөнөтүү мүмкүн эмес,{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>{' '}
              сайтында балансыңызды толукташыңыз керек.
            </>
          ),
        },
      },
      {
        name: 'notFoundNumber',
        translation: {
          ru: 'Не удалось найти номер!',
          kg: 'Номерин таппай койдум!',
        },
      },
      {
        name: 'wrongNumber',
        translation: {
          ru: 'Неверный номер!',
          kg: 'Туура эмес номер!',
        },
      },
      {
        name: 'wrongCode',
        translation: {
          ru: 'Неправильный код!',
          kg: 'Туура эмес код!',
        },
      },
      {
        name: 'editProfile',
        translation: {
          ru: 'Редактирование профиля',
          kg: 'Профилди түзөтүү',
        },
      },
      {
        name: 'image',
        translation: {
          ru: 'Изображение',
          kg: 'Сүрөт',
        },
      },
      {
        name: 'saveButton',
        translation: {
          ru: 'Сохранить',
          kg: 'Сактоо',
        },
      },
      {
        name: 'messageApi',
        translation: {
          ru: 'Пожалуйста, введите номер в правильном формате',
          kg: 'Номерди туура форматта киргизиңиз',
        },
      },
      {
        name: 'passwordUpdated',
        translation: {
          ru: 'Пароль успешно обновлен!',
          kg: 'Сырсөз ийгиликтүү жаңыртылды!',
        },
      },
      {
        name: 'titleEnterPhone',
        translation: {
          ru: 'Введите номер телефона',
          kg: 'Телефон номерин киргизиңиз',
        },
      },
      {
        name: 'accessCodeSent',
        translation: {
          ru: 'Мы отправим вам код подтверждения',
          kg: 'Биз сизге ырастоо кодун жөнөтөбүз',
        },
      },
      {
        name: 'enterPhoneNumber',
        translation: {
          ru: 'Пожалуйста, введите номер телефона.',
          kg: 'Телефон номериңизди киргизиңиз.',
        },
      },
      {
        name: 'phoneNumber',
        translation: {
          ru: 'Номер телефона',
          kg: 'Телефон номуру',
        },
      },
      {
        name: 'buttonContinue',
        translation: {
          ru: 'Продолжить',
          kg: 'Улантуу',
        },
      },
      {
        name: 'back',
        translation: {
          ru: 'Назад',
          kg: 'Артка',
        },
      },
      {
        name: 'enterOTPCode',
        translation: {
          ru: 'Введите код из СМС',
          kg: 'СМСтен келген кодду киргизиңиз',
        },
      },
      {
        name: 'OTPCodeSentAnNumber',
        translation: {
          ru: 'Код подтверждения отправлен на номер',
          kg: 'Ырастоо коду номерге жөнөтүлдү',
        },
      },
      {
        name: 'enterOTPCode',
        translation: {
          ru: 'Пожалуйста, введите код.',
          kg: 'Сураныч, кодду киргизиңиз.',
        },
      },
      {
        name: 'checkCode',
        translation: {
          ru: 'Проверить',
          kg: 'Текшерүү',
        },
      },
      {
        name: 'noCode',
        translation: {
          ru: 'Не пришел код?',
          kg: 'Кодду алган жоксузбу?',
        },
      },
      {
        name: 'sendAgain',
        translation: {
          ru: 'Отправить еще раз',
          kg: 'Кайра жөнөтүү',
        },
      },
      {
        name: 'createNewPassword',
        translation: {
          ru: 'Придумайте новый пароль',
          kg: 'Жаңы сырсөз түзүңүз',
        },
      },
      {
        name: 'enterNewPassword',
        translation: {
          ru: 'Введите новый пароль.',
          kg: 'Жаңы сырсөз киргизиңиз.',
        },
      },
      {
        name: 'minLength',
        translation: {
          ru: 'Минимальная длина пароля 6 символов.',
          kg: 'Минималдуу сырсөз узундугу 6 белгиден турат.',
        },
      },
      {
        name: 'confirmNewPassword',
        translation: {
          ru: 'Подтвердите новый пароль.',
          kg: 'Жаңы сырсөзүңүздү ырастаңыз.',
        },
      },
      {
        name: 'errorPassword',
        translation: {
          ru: 'Пароли не совпадают',
          kg: 'Сырсөз дал келбейт',
        },
      },
      {
        name: 'confirmPassword',
        translation: {
          ru: 'Подтвердите пароль.',
          kg: 'Сырсөздү ырастаңыз.',
        },
      },
      {
        name: 'confirm',
        translation: {
          ru: 'Подтвердить',
          kg: 'Ырастоо',
        },
      },
      {
        name: 'entrePassword',
        translation: {
          ru: 'Пожалуйста, введите пароль',
          kg: 'Сырсөзүңүздү киргизиңиз',
        },
      },
      {
        name: 'password',
        translation: {
          ru: 'Пароль',
          kg: 'Купуя сөз',
        },
      },
      {
        name: 'forgotPassword',
        translation: {
          ru: 'Забыли пароль?',
          kg: 'Сыр сөзүңүздү унуттуңузбу?',
        },
      },
      {
        name: 'toComeIn',
        translation: {
          ru: 'Войти',
          kg: 'Кирүү',
        },
      },
      {
        name: 'forgotPassword',
        translation: {
          ru: 'Забыли пароль?',
          kg: 'Купуя сөз',
        },
      },
      {
        name: 'login',
        translation: {
          ru: 'Вход в систему',
          kg: 'Кирүү',
        },
      },
      {
        name: 'moder',
        translation: {
          ru: 'Менеджер',
          kg: 'Менеджер',
        },
      },
      {
        name: 'admin',
        translation: {
          ru: 'Администратор',
          kg: 'Администратор',
        },
      },
      {
        name: 'owner',
        translation: {
          ru: 'Владелец',
          kg: 'Ээси',
        },
      },
      {
        name: 'passwordChanged',
        translation: {
          ru: 'Пароль успешно изменен!',
          kg: 'Сырсөз ийгиликтүү өзгөртүлдү!',
        },
      },
      {
        name: 'error',
        translation: {
          ru: 'Что-то пошло не так',
          kg: 'Бир жерден ката кетти',
        },
      },
      {
        name: 'profile',
        translation: {
          ru: 'Профиль',
          kg: 'Профиль',
        },
      },
      {
        name: 'manageYourData',
        translation: {
          ru: 'Управляйте своими персональными данными',
          kg: 'Жеке маалыматтарыңызды башкарыңыз',
        },
      },
      {
        name: 'imageProfile',
        translation: {
          ru: 'Фото профиля',
          kg: 'Профиль сүрөтү',
        },
      },
      {
        name: 'infoProfile',
        translation: {
          ru: 'Информация профиля',
          kg: 'Профиль маалыматы',
        },
      },
      {
        name: 'jobTitle',
        translation: {
          ru: 'Должность',
          kg: 'Кызматы',
        },
      },
      {
        name: 'contactData',
        translation: {
          ru: 'Контактные данные',
          kg: 'Байланыш маалыматтары',
        },
      },
      {
        name: 'changePassword',
        translation: {
          ru: 'Изменить пароль',
          kg: 'Сырсөздү өзгөртүү',
        },
      },
      {
        name: 'nowPassword',
        translation: {
          ru: 'Текущий пароль',
          kg: 'Учурдагы Сырсөз',
        },
      },
      {
        name: 'enterPassword',
        translation: {
          ru: 'Введите пароль',
          kg: 'Сырсөздү киргизиңиз',
        },
      },
      {
        name: 'newPassword',
        translation: {
          ru: 'Новый пароль',
          kg: 'Жаңы Сыр сөз',
        },
      },
    ],
  },
  {
    name: 'Yurts',
    data: [
      {
        name: 'issued',
        translation: {
          ru: 'оформлен на',
          kg: 'күнү чыгарылган',
        },
      },
      {
        name: 'titleDescription',
        translation: {
          ru: 'Описание',
          kg: 'Сүрөттөмө',
        },
      },
      {
        name: 'pricePerDay',
        translation: {
          ru: 'сом/день',
          kg: 'сом/күн',
        },
      },
      {
        name: 'from',
        translation: {
          ru: 'от',
          kg: 'тартып',
        },
      },
      {
        name: 'blocked',
        translation: {
          ru: 'Заблокировать',
          kg: 'Блоктоо',
        },
      },
      {
        name: 'unlock',
        translation: {
          ru: 'Разблокировать',
          kg: 'Кулпусун ачуу',
        },
      },
      {
        name: 'blockedThisYurt',
        translation: {
          ru: 'Заблокировать эту юрту?',
          kg: 'Бул боз үйдү тос?',
        },
      },
      {
        name: 'unlockThisYurt',
        translation: {
          ru: 'Разблокировать эту юрту?',
          kg: 'Бул боз үйдүн кулпусун ач?',
        },
      },
      {
        name: 'blockedConfirm',
        translation: {
          ru: 'Вы уверены что хотите заблокировать эту юрту?',
          kg: 'Сиз чын эле бул боз үйдү тоскуңуз келеби?',
        },
      },
      {
        name: 'unlockConfirm',
        translation: {
          ru: 'Вы уверены что хотите разблокировать эту юрту?',
          kg: 'Бул боз үйдүн кулпусун чын эле ачкыңыз келеби?',
        },
      },
      {
        name: 'okText',
        translation: {
          ru: 'Да',
          kg: 'Ооба',
        },
      },
      {
        name: 'noText',
        translation: {
          ru: 'Нет',
          kg: 'Жок',
        },
      },
      {
        name: 'editYurt',
        translation: {
          ru: 'Изменить юрту',
          kg: 'Боз үйдү өзгөртүү',
        },
      },
      {
        name: 'edit',
        translation: {
          ru: 'Изменить',
          kg: 'Өзгөртүү',
        },
      },
      {
        name: 'newYurt',
        translation: {
          ru: 'Новая юрта',
          kg: 'Жаңы боз үй',
        },
      },
      {
        name: 'entreNameYurt',
        translation: {
          ru: 'Пожалуйста, введите название юрты.',
          kg: 'Боз үйдүн атын жазыңыз.',
        },
      },
      {
        name: 'nameYurt',
        translation: {
          ru: 'Название',
          kg: 'Аты',
        },
      },
      {
        name: 'entreDescriptionYurt',
        translation: {
          ru: 'Пожалуйста, введите описание юрты.',
          kg: 'Боз үйдүн сүрөттөмөсүн жазыңыз.',
        },
      },
      {
        name: 'descriptionYurt',
        translation: {
          ru: 'Описание юрты',
          kg: 'Боз үйдүн сүрөттөлүшү',
        },
      },
      {
        name: 'enterPriceYurt',
        translation: {
          ru: 'Пожалуйста, введите цену за юрту.',
          kg: 'Бир боз үйдүн баасын киргизиңиз.',
        },
      },
      {
        name: 'price',
        translation: {
          ru: 'Цена KGS',
          kg: 'Баасы сом',
        },
      },
      {
        name: 'currency',
        translation: {
          ru: 'Сом',
          kg: 'Сом',
        },
      },
      {
        name: 'selectImage',
        translation: {
          ru: 'Пожалуйста, выберите изображение для юрты.',
          kg: 'Сураныч, боз үй үчүн сүрөт тандаңыз.',
        },
      },
      {
        name: 'image',
        translation: {
          ru: 'Изображение',
          kg: 'Сүрөт',
        },
      },
      {
        name: 'buttonSave',
        translation: {
          ru: 'Сохранить',
          kg: 'Сактоо',
        },
      },
      {
        name: 'buttonAdd',
        translation: {
          ru: 'Добавить',
          kg: 'Кошуу',
        },
      },
      {
        name: 'showBlockedYurts',
        translation: {
          ru: 'Показать неактивные юрты',
          kg: 'Тосулган боз үйлөрдү көрсөтүү',
        },
      },
    ],
  },
  {
    name: 'CustomLayout',
    data: [
      {
        name: 'smsNotSent',
        translation: {
          ru: 'Сообщение клиенту о заказе не отправлено!',
          kg: `Буйрутма тууралуу кардарга билдирүү жөнөтүлгөн эмес!`,
        },
      },
      {
        name: 'smsSent',
        translation: {
          ru: 'Сообщение клиенту о заказе отправлено!',
          kg: `Заказ тууралуу кардарга билдирүү жөнөтүлдү!`,
        },
      },
      {
        name: 'outOfMoney',
        translation: {
          ru: (
            <>
              Сообщение клиенту о заказе не отправлено, так как у вас недостаточно средств в сервисе{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>
              .
            </>
          ),
          kg: (
            <>
              Заказ жөнүндө кардарга билдирүү жөнөтүлгөн жок, анткени сизде{' '}
              <a href='https://smspro.nikita.kg/' target='_blank' rel='noopener noreferrer'>
                nikita.kg
              </a>{' '}
              кызматында акчаңыз жетишсиз.
            </>
          ),
        },
      },
      {
        name: 'modalConfirm',
        translation: {
          ru: 'Вы действительно хотите выйти?',
          kg: 'Чын эле чыккыңыз келеби?',
        },
      },
      {
        name: 'okText',
        translation: {
          ru: 'Да',
          kg: 'Ооба',
        },
      },
      {
        name: 'noText',
        translation: {
          ru: 'Нет',
          kg: 'Жок',
        },
      },
      {
        name: 'addYurt',
        translation: {
          ru: 'Добавить юрту',
          kg: 'Боз үй кошуу',
        },
      },
      {
        name: 'addOrder',
        translation: {
          ru: 'Добавить заказ',
          kg: 'Буйрутма кошуу',
        },
      },
      {
        name: 'addService',
        translation: {
          ru: 'Добавить услугу',
          kg: 'Кызмат кошуу',
        },
      },
      {
        name: 'profile',
        translation: {
          ru: 'Пользователь',
          kg: 'Колдонуучу',
        },
      },
      {
        name: 'yurts',
        translation: {
          ru: 'Юрты',
          kg: 'Боз үйлөр',
        },
      },
      {
        name: 'services',
        translation: {
          ru: 'Услуги',
          kg: 'Кызматтар',
        },
      },
      {
        name: 'access',
        translation: {
          ru: 'Доступ',
          kg: 'Мүмкүнчүлүк',
        },
      },
      {
        name: 'orders',
        translation: {
          ru: 'Заказы',
          kg: 'Заказдар',
        },
      },
      {
        name: 'reports',
        translation: {
          ru: 'Отчеты',
          kg: 'Отчеттор',
        },
      },
      {
        name: 'clients',
        translation: {
          ru: 'Клиенты',
          kg: 'Кардарлар',
        },
      },
      {
        name: 'logout',
        translation: {
          ru: 'Выйти',
          kg: 'Чыгуу',
        },
      },
    ],
  },
  {
    name: 'FileInput',
    data: [
      {
        name: 'addButton',
        translation: {
          ru: 'Выбрать',
          kg: 'Тандоо',
        },
      },
    ],
  },
  {
    name: 'NotFound',
    data: [
      {
        name: 'subTitle',
        translation: {
          ru: 'К сожалению, страница, которую вы посетили, не существует.',
          kg: 'Кечиресиз, сиз кирген барак жок.',
        },
      },
    ],
  },
];

export const returnTranslation = (name: string, key: TLanguage) => {
  const targetFeature = allLanguages.filter((item) => item.name === name);
  const targetTranslation = targetFeature[0].data.map((item) => {
    return {
      name: item.name,
      translation: item.translation[key] ?? item.translation.kg,
    };
  });

  const translation: Record<string, string> = targetTranslation.reduce((object, value) => {
    return { ...object, [value.name]: value.translation };
  }, {});

  return translation;
};
