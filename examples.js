// Примеры использования базы данных масел
// Этот файл показывает, как работать с базой данных

// Пример 1: Добавление нового масла
function addNewOilExample() {
    const newOil = {
        id: 'olive',                        // Уникальный ID
        name: 'Оливковое масло',            // Название
        type: 'Оливковое',                  // Тип
        pricePer100ml: 350,                 // Цена за 100 мл
        volumeDiscounts: [                  // Скидки по объемам
            {
                volume: 100,
                multiplier: 1,
                discount: 0
            },
            {
                volume: 250,
                multiplier: 2.2,            // Скидка 12%
                discount: 12
            },
            {
                volume: 500,
                multiplier: 4.0,            // Скидка 20%
                discount: 20
            },
            {
                volume: 1000,
                multiplier: 7.0,            // Скидка 30%
                discount: 30
            }
        ],
        description: 'Классическое оливковое масло первого отжима. Богато мононенасыщенными жирами.',
        properties: ['Омега-9', 'Витамин E', 'Полифенолы'],
        icon: 'fas fa-leaf'
    };
    
    // Добавляем масло в базу данных
    const success = addOil(newOil);
    if (success) {
        console.log('Оливковое масло успешно добавлено!');
        // Перезагружаем страницу для обновления интерфейса
        // location.reload();
    }
}

// Пример 2: Обновление цены существующего масла
function updateOilPriceExample() {
    // Обновляем цену подсолнечного масла
    const newData = {
        pricePer100ml: 180,  // Новая цена
        description: 'Обновленное описание подсолнечного масла с новыми свойствами.'
    };
    
    const success = updateOil('sunflower', newData);
    if (success) {
        console.log('Цена подсолнечного масла обновлена!');
        // Перезагружаем страницу для обновления интерфейса
        // location.reload();
    }
}

// Пример 3: Изменение скидок для льняного масла
function updateFlaxDiscountsExample() {
    const newDiscounts = [
        {
            volume: 100,
            multiplier: 1,
            discount: 0
        },
        {
            volume: 250,
            multiplier: 2.1,    // Увеличиваем скидку до 16%
            discount: 16
        },
        {
            volume: 500,
            multiplier: 3.8,    // Увеличиваем скидку до 24%
            discount: 24
        },
        {
            volume: 1000,
            multiplier: 6.5,    // Увеличиваем скидку до 35%
            discount: 35
        }
    ];
    
    const success = updateOil('flax', { volumeDiscounts: newDiscounts });
    if (success) {
        console.log('Скидки для льняного масла обновлены!');
        // Перезагружаем страницу для обновления интерфейса
        // location.reload();
    }
}

// Пример 4: Удаление масла
function removeOilExample() {
    // Удаляем тыквенное масло (если нужно)
    const success = removeOil('pumpkin');
    if (success) {
        console.log('Тыквенное масло удалено из базы данных!');
        // Перезагружаем страницу для обновления интерфейса
        // location.reload();
    }
}

// Пример 5: Получение информации о масле
function getOilInfoExample() {
    const oil = getOilById('sesame');
    if (oil) {
        console.log('Информация о кунжутном масле:', oil);
        console.log('Цена за 100 мл:', oil.pricePer100ml);
        console.log('Доступные объемы:', oil.volumeDiscounts.map(d => d.volume + 'мл'));
    }
}

// Пример 6: Расчет стоимости с учетом скидки
function calculatePriceExample() {
    const oilId = 'walnut';
    const volume = 500;
    
    const price = calculateOilPrice(oilId, volume);
    const discount = getVolumeDiscount(oilId, volume);
    
    console.log(`Стоимость грецкого масла ${volume}мл: ${price}₽`);
    if (discount && discount.discount > 0) {
        console.log(`Применена скидка: ${discount.discount}%`);
    }
}

// Пример 7: Получение всех масел с ценами
function getAllOilsWithPricesExample() {
    const oils = getAllOils();
    console.log('Все доступные масла:');
    
    oils.forEach(oil => {
        console.log(`${oil.name}: от ${oil.pricePer100ml}₽/100мл`);
        console.log('  Скидки:', oil.volumeDiscounts.map(d => 
            `${d.volume}мл - ${d.discount}%`
        ).join(', '));
    });
}

// Пример 8: Изменение настроек
function updateSettingsExample() {
    // Изменяем стоимость бутылочки
    additionalSettings.bottlePrice = 75;
    console.log('Стоимость бутылочки изменена на 75₽');
    
    // Изменяем валюту
    additionalSettings.currency = '₽';
    console.log('Валюта установлена: ₽');
}

// Пример 9: Создание нового масла с полными данными
function createCompleteOilExample() {
    const completeOil = {
        id: 'coconut',
        name: 'Кокосовое масло',
        type: 'Кокосовое',
        pricePer100ml: 450,
        volumeDiscounts: [
            { volume: 100, multiplier: 1, discount: 0 },
            { volume: 250, multiplier: 2.1, discount: 16 },
            { volume: 500, multiplier: 3.8, discount: 24 },
            { volume: 1000, multiplier: 6.5, discount: 35 }
        ],
        description: 'Экзотическое кокосовое масло с нежным ароматом. Отлично подходит для косметических целей и кулинарии.',
        properties: ['Лауриновая кислота', 'Среднецепочечные триглицериды', 'Витамин E'],
        icon: 'fas fa-tree'
    };
    
    const success = addOil(completeOil);
    if (success) {
        console.log('Кокосовое масло добавлено в базу данных!');
        // Перезагружаем страницу для обновления интерфейса
        // location.reload();
    }
}

// Пример 10: Массовое обновление цен
function bulkUpdatePricesExample() {
    const priceUpdates = [
        { id: 'sunflower', newPrice: 160 },
        { id: 'flax', newPrice: 220 },
        { id: 'sesame', newPrice: 280 },
        { id: 'pumpkin', newPrice: 320 },
        { id: 'walnut', newPrice: 450 }
    ];
    
    priceUpdates.forEach(update => {
        updateOil(update.id, { pricePer100ml: update.newPrice });
    });
    
    console.log('Цены всех масел обновлены!');
    // Перезагружаем страницу для обновления интерфейса
    // location.reload();
}

// Функция для демонстрации всех примеров
function runAllExamples() {
    console.log('=== ДЕМОНСТРАЦИЯ РАБОТЫ С БАЗОЙ ДАННЫХ ===');
    
    console.log('\n1. Информация о кунжутном масле:');
    getOilInfoExample();
    
    console.log('\n2. Расчет стоимости грецкого масла:');
    calculatePriceExample();
    
    console.log('\n3. Все масла с ценами:');
    getAllOilsWithPricesExample();
    
    console.log('\n4. Обновление настроек:');
    updateSettingsExample();
    
    console.log('\n=== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА ===');
    console.log('\nДля добавления нового масла вызовите: addNewOilExample()');
    console.log('Для обновления цены: updateOilPriceExample()');
    console.log('Для изменения скидок: updateFlaxDiscountsExample()');
    console.log('Для удаления масла: removeOilExample()');
}

// Запускаем демонстрацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Раскомментируйте строку ниже для автоматического запуска демонстрации
    // runAllExamples();
    
    console.log('База данных масел загружена!');
    console.log('Доступные функции:');
    console.log('- addNewOilExample() - добавить новое масло');
    console.log('- updateOilPriceExample() - обновить цену');
    console.log('- updateFlaxDiscountsExample() - изменить скидки');
    console.log('- removeOilExample() - удалить масло');
    console.log('- runAllExamples() - запустить все примеры');
}); 