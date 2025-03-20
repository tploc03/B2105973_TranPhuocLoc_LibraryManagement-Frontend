// src/utils/format.js
import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy');
};

export const formatCurrency = (number) => {
  if (isNaN(number)) return '0';
  return Number(number).toLocaleString('vi-VN');
};

export const parseDate = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};