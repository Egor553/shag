
import { Mentor, UserRole } from './types';

export const MENTORS: Mentor[] = [
  {
    id: '1',
    role: UserRole.ENTREPRENEUR,
    email: 'sokolovsky@example.com',
    isLoggedIn: false,
    name: 'Александр Соколовский',
    industry: 'Маркетинг',
    city: 'Москва',
    experience: '10+ лет в бизнесе',
    description: 'Основатель Tooligram и автор популярного подкаста. Эксперт по привлечению трафика и системному маркетингу.',
    achievements: [
      'Оборот компаний 500млн+ в год',
      'Автор топового YouTube канала',
      'Более 5000 учеников'
    ],
    requestToYouth: 'Ищу свежие идеи в сфере AI-маркетинга и ассистента с горящими глазами.',
    values: ['Честность', 'Скорость', 'Твердость'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://picsum.photos/seed/alex/400/400',
    singlePrice: 2500,
    groupPrice: 800
  }
];

export const INDUSTRIES = [
  'Все', 
  'Маркетинг', 
  'IT', 
  'Финансы', 
  'Производство', 
  'Ритейл', 
  'Красота и здоровье', 
  'HoReCa', 
  'Недвижимость и Строительство', 
  'Туризм'
];
export const CITIES = ['Все', 'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'];
