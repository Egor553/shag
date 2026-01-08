
import { Mentor, UserRole } from './types';

export const INDUSTRIES = [
  'Все', 
  'IT & AI', 
  'E-commerce', 
  'Маркетинг & Media', 
  'Инвестиции', 
  'Retail', 
  'Производство',
  'HoReCa', 
  'Недвижимость'
];

export const CITIES = ['Все', 'Москва', 'Дубай', 'Санкт-Петербург', 'Бали', 'Лондон'];

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    role: UserRole.ENTREPRENEUR,
    email: 'sokolovsky@shag.ru',
    isLoggedIn: false,
    name: 'Александр Соколовский',
    industry: 'Маркетинг & Media',
    city: 'Москва',
    experience: '12 лет в Digital',
    description: 'Основатель Tooligram и автор крупнейшего бизнес-подкаста в СНГ. Помог привлечь более 10 млн лидов для клиентов.',
    achievements: [
      'Оборот компаний 700млн+ в год',
      'Топ-1 бизнес-подкаст на YouTube',
      'Построил крупнейшую сеть Telegram-каналов'
    ],
    requestToYouth: 'Ищу талантливых креаторов и ассистентов, готовых работать на результат и быстро учиться.',
    values: ['Честность', 'Скорость', 'Результат'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    singlePrice: 15000,
    groupPrice: 5000,
    direction: 'Системный маркетинг и личный бренд'
  },
  {
    id: 'm2',
    role: UserRole.ENTREPRENEUR,
    email: 'volkov@shag.ru',
    isLoggedIn: false,
    name: 'Артем Волков',
    industry: 'IT & AI',
    city: 'Дубай',
    experience: '8 лет в разработке',
    description: 'Серийный IT-предприниматель. Основал 3 SaaS-платформы с выходом на международный рынок.',
    achievements: [
      'Привлек $2M инвестиций в свои проекты',
      'Вывел продукт в топ Product Hunt',
      'Сформировал удаленную команду из 50 человек'
    ],
    requestToYouth: 'Ищу идеи в сфере нейросетей и автоматизации бизнес-процессов.',
    values: ['Инновации', 'Глобальное мышление', 'Свобода'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    singlePrice: 25000,
    groupPrice: 8000,
    direction: 'Масштабирование IT-продуктов'
  },
  {
    id: 'm3',
    role: UserRole.ENTREPRENEUR,
    email: 'elena_ecom@shag.ru',
    isLoggedIn: false,
    name: 'Елена Белова',
    industry: 'E-commerce',
    city: 'Москва',
    experience: '10 лет на маркетплейсах',
    description: 'Топ-селлер Wildberries и Ozon. Владелец бренда одежды с собственным производством в России.',
    achievements: [
      'Выручка 40 млн ₽ в месяц на маркетплейсах',
      'Собственное производство в Иваново',
      'Вывела 20+ учеников на доход от 1 млн ₽'
    ],
    requestToYouth: 'Поделюсь опытом выбора ниши и работы с Китаем в обмен на помощь в SMM.',
    values: ['Дисциплина', 'Эстетика', 'Твёрдость'],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    singlePrice: 12000,
    groupPrice: 4000,
    direction: 'Товарный бизнес и маркетплейсы'
  },
  {
    id: 'm4',
    role: UserRole.ENTREPRENEUR,
    email: 'dmitry_invest@shag.ru',
    isLoggedIn: false,
    name: 'Дмитрий Разумовский',
    industry: 'Инвестиции',
    city: 'Бали',
    experience: '15 лет в финансах',
    description: 'Венчурный инвестор. Бывший топ-менеджер крупного инвестиционного банка. Знаю всё о том, как привлечь капитал.',
    achievements: [
      'Управлял портфелем в $100M',
      'Закрыл более 30 сделок M&A',
      'Создал закрытый клуб инвесторов'
    ],
    requestToYouth: 'Помогаю упаковать проект для привлечения инвестиций.',
    values: ['Стратегия', 'Масштаб', 'Окружение'],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    singlePrice: 50000,
    groupPrice: 15000,
    direction: 'Инвестиции и упаковка бизнеса'
  }
];
