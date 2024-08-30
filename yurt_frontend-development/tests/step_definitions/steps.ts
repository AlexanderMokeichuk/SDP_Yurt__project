const { I } = inject();
// Add in your custom step files

Given('Я нахожусь на странице {string}', (page: string) => {
  I.amOnPage(page);
});

When('Я ввожу {string} в поле {string}', (value: string, fieldId: string) => {
  I.wait(1);
  I.fillField({ id: fieldId }, value);
});

When('Я нажимаю кнопку {string}', (button: string) => {
  I.click(button);
  I.wait(3);
});

Then('Я вижу кнопку {string}', (buttonText: string) => {
  I.see(buttonText);
});

When('Я вижу {string}', (text: string) => {
  I.see(text);
});

Then('Я вижу текст {string}', (text: string) => {
  I.see(text);
});

When('Я нажимаю кнопку с id {string}', (id: string) => {
  I.wait(1);
  I.click({ id: id });
});

When('Я ввожу текущую дату в поле {string}', (fieldId: string) => {
  I.click({ id: fieldId });
  I.click('Сегодня');
});

When('Я нажимаю на селект {string}', (button: string) => {
  I.wait(1);
  I.click(button, '.ant-select-selection-placeholder');
});

When('Я выбираю опцию {string}', (title: string) => {
  I.click('div[title=' + `"${title}"` + ']');
  I.wait(4);
});

Then('Я вижу юрту {string}', (yurtName: string) => {
  I.wait(4);
  I.see(yurtName);
});

Then('Я вижу услугу {string}', (serviceName: string) => {
  I.wait(4);
  I.see(serviceName);
});
