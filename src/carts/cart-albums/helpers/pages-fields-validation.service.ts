import { CompositionAlbumPageFieldDto } from '../dto/store-cart-album.dto';
import { AlbumPage } from '../../../albums/albums/entities/album-page.entity';
import { createValidationException } from '@1creator/backend';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesFieldsValidationService {
    validateAndFilter(pagesDto: CompositionAlbumPageFieldDto[], pages: AlbumPage[]) {
        const res: CompositionAlbumPageFieldDto[] = [];

        const errors = pages.reduce((pagesAcc, page, pageIdx) => {
            const pageFieldsDto = pagesDto.find(i => i.page === page.id);

            const fields = page.fields.map((field, fieldIdx) => {
                const fieldDto = pageFieldsDto?.fields.find(i => i.name === field.name);
                if (!fieldDto) {
                    if (!pagesAcc[pageIdx]) {
                        pagesAcc[pageIdx] = { fields: {} };
                    }
                    pagesAcc[pageIdx].fields[fieldIdx] = ['Поле должно быть заполнено'];
                }
                return fieldDto;
            });
            res.push({
                page: page.id,
                fields: fields as any,
            });

            return pagesAcc;
        }, {});

        if (Object.keys(errors).length) {
            throw createValidationException(errors);
        }

        return res;
    }
}