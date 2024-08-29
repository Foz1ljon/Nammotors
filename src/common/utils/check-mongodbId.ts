import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/**
 * Berilgan ID ni tasdiqlaydi.
 * @param id - Tasdiqlanishi kerak bo'lgan ID.
 * @throws BadRequestException agar ID noto'g'ri bo'lsa.
 */
export const checkId = (id: string): void => {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Noto`g`ri ID');
  }
};
