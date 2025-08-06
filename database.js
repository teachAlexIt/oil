// База данных масел холодного отжима
// Здесь вы можете легко добавлять, удалять или изменять данные о маслах

const oilsDatabase = [
    {
        id: 'sunflower',                    // Уникальный идентификатор масла
        name: 'Подсолнечное масло',         // Название масла для отображения
        type: 'Подсолнечное',               // Тип масла
        pricePer100ml: 150,                 // Стоимость за 100 мл в рублях
        volumeDiscounts: [                  // Скидки при увеличении объема
            {
                volume: 100,                // Объем в мл
                multiplier: 1,              // Множитель цены (без скидки)
                discount: 0,                // Скидка в процентах
                timeMinutes: 5              // Время получения в минутах
            },
            {
                volume: 250,                // Объем в мл
                multiplier: 2.3,            // Множитель цены (скидка 8%)
                discount: 8,                // Скидка в процентах
                timeMinutes: 8              // Время получения в минутах
            },
            {
                volume: 500,                // Объем в мл
                multiplier: 4.2,            // Множитель цены (скидка 16%)
                discount: 16,               // Скидка в процентах
                timeMinutes: 12             // Время получения в минутах
            },
            {
                volume: 1000,               // Объем в мл
                multiplier: 7.5,            // Множитель цены (скидка 25%)
                discount: 25,               // Скидка в процентах
                timeMinutes: 20             // Время получения в минутах
            }
        ],
        description: 'Классическое масло с мягким ореховым вкусом. Богато витамином E и линолевой кислотой.',
        properties: ['Витамин E', 'Омега-6', 'Антиоксиданты'], // Полезные свойства
        icon: 'fas fa-sun'                  // Иконка Font Awesome
    },
    
    {
        id: 'flax',
        name: 'Льняное масло',
        type: 'Льняное',
        pricePer100ml: 200,
        volumeDiscounts: [
            {
                volume: 100,
                multiplier: 1,
                discount: 0,
                timeMinutes: 6
            },
            {
                volume: 250,
                multiplier: 2.2,            // Скидка 12%
                discount: 12,
                timeMinutes: 10
            },
            {
                volume: 500,
                multiplier: 4.0,            // Скидка 20%
                discount: 20,
                timeMinutes: 15
            },
            {
                volume: 1000,
                multiplier: 7.0,            // Скидка 30%
                discount: 30,
                timeMinutes: 25
            }
        ],
        description: 'Рекордсмен по содержанию Омега-3 кислот. Имеет характерный горьковатый вкус.',
        properties: ['Омега-3', 'Витамин F', 'Клетчатка'],
        icon: 'fas fa-seedling'
    },
    
    {
        id: 'sesame',
        name: 'Кунжутное масло',
        type: 'Кунжутное',
        pricePer100ml: 250,
        volumeDiscounts: [
            {
                volume: 100,
                multiplier: 1,
                discount: 0,
                timeMinutes: 7
            },
            {
                volume: 250,
                multiplier: 2.4,            // Скидка 4%
                discount: 4,
                timeMinutes: 12
            },
            {
                volume: 500,
                multiplier: 4.5,            // Скидка 10%
                discount: 10,
                timeMinutes: 18
            },
            {
                volume: 1000,
                multiplier: 8.0,            // Скидка 20%
                discount: 20,
                timeMinutes: 30
            }
        ],
        description: 'Ароматное масло с насыщенным ореховым вкусом. Богато кальцием и цинком.',
        properties: ['Кальций', 'Цинк', 'Сезамин'],
        icon: 'fas fa-circle'
    },
    
    {
        id: 'pumpkin',
        name: 'Тыквенное масло',
        type: 'Тыквенное',
        pricePer100ml: 300,
        volumeDiscounts: [
            {
                volume: 100,
                multiplier: 1,
                discount: 0,
                timeMinutes: 8
            },
            {
                volume: 250,
                multiplier: 2.3,            // Скидка 8%
                discount: 8,
                timeMinutes: 14
            },
            {
                volume: 500,
                multiplier: 4.2,            // Скидка 16%
                discount: 16,
                timeMinutes: 22
            },
            {
                volume: 1000,
                multiplier: 7.5,            // Скидка 25%
                discount: 25,
                timeMinutes: 35
            }
        ],
        description: 'Экзотическое масло с богатым вкусом. Отлично подходит для салатов и соусов.',
        properties: ['Цинк', 'Магний', 'Антиоксиданты'],
        icon: 'fas fa-pump-soap'
    },
    
    {
        id: 'walnut',
        name: 'Грецкое масло',
        type: 'Грецкое',
        pricePer100ml: 400,
        volumeDiscounts: [
            {
                volume: 100,
                multiplier: 1,
                discount: 0,
                timeMinutes: 10
            },
            {
                volume: 250,
                multiplier: 2.2,            // Скидка 12%
                discount: 12,
                timeMinutes: 18
            },
            {
                volume: 500,
                multiplier: 4.0,            // Скидка 20%
                discount: 20,
                timeMinutes: 28
            },
            {
                volume: 1000,
                multiplier: 7.0,            // Скидка 30%
                discount: 30,
                timeMinutes: 45
            }
        ],
        description: 'Премиальное масло с насыщенным ореховым вкусом. Идеально для изысканных блюд.',
        properties: ['Омега-3', 'Белки', 'Витамин E'],
        icon: 'fas fa-seedling'
    }
];

// Дополнительные настройки
const additionalSettings = {
    bottlePrice: 50,                        // Стоимость бутылочки в рублях
    currency: '₽',                          // Валюта
    defaultVolume: 100,                     // Объем по умолчанию в мл
    maxVolume: 1000                         // Максимальный объем в мл
};

// Функции для работы с базой данных

/**
 * Получить масло по ID
 * @param {string} id - Идентификатор масла
 * @returns {object|null} - Объект масла или null если не найдено
 */
function getOilById(id) {
    return oilsDatabase.find(oil => oil.id === id) || null;
}

/**
 * Получить все масла
 * @returns {array} - Массив всех масел
 */
function getAllOils() {
    return oilsDatabase;
}

/**
 * Получить скидку для конкретного объема масла
 * @param {string} oilId - ID масла
 * @param {number} volume - Объем в мл
 * @returns {object|null} - Объект скидки или null
 */
function getVolumeDiscount(oilId, volume) {
    const oil = getOilById(oilId);
    if (!oil) return null;
    
    return oil.volumeDiscounts.find(discount => discount.volume === volume) || null;
}

/**
 * Рассчитать стоимость масла с учетом объема
 * @param {string} oilId - ID масла
 * @param {number} volume - Объем в мл
 * @returns {number} - Стоимость в рублях
 */
function calculateOilPrice(oilId, volume) {
    const oil = getOilById(oilId);
    if (!oil) return 0;
    
    const discount = getVolumeDiscount(oilId, volume);
    if (!discount) return 0;
    
    return Math.round(oil.pricePer100ml * discount.multiplier);
}

/**
 * Добавить новое масло в базу данных
 * @param {object} oilData - Данные нового масла
 */
function addOil(oilData) {
    // Проверяем, что ID уникален
    if (getOilById(oilData.id)) {
        console.error('Масло с таким ID уже существует!');
        return false;
    }
    
    oilsDatabase.push(oilData);
    console.log(`Масло "${oilData.name}" добавлено в базу данных`);
    return true;
}

/**
 * Обновить существующее масло
 * @param {string} oilId - ID масла для обновления
 * @param {object} newData - Новые данные
 */
function updateOil(oilId, newData) {
    const index = oilsDatabase.findIndex(oil => oil.id === oilId);
    if (index === -1) {
        console.error('Масло не найдено!');
        return false;
    }
    
    oilsDatabase[index] = { ...oilsDatabase[index], ...newData };
    console.log(`Масло "${oilsDatabase[index].name}" обновлено`);
    return true;
}

/**
 * Удалить масло из базы данных
 * @param {string} oilId - ID масла для удаления
 */
function removeOil(oilId) {
    const index = oilsDatabase.findIndex(oil => oil.id === oilId);
    if (index === -1) {
        console.error('Масло не найдено!');
        return false;
    }
    
    const oilName = oilsDatabase[index].name;
    oilsDatabase.splice(index, 1);
    console.log(`Масло "${oilName}" удалено из базы данных`);
    return true;
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        oilsDatabase,
        additionalSettings,
        getOilById,
        getAllOils,
        getVolumeDiscount,
        calculateOilPrice,
        addOil,
        updateOil,
        removeOil
    };
} 