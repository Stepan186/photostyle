import { IPaymentProvider } from './payment-provider.interface';

export enum BankType {
    Alfa = 'alfaBankService',
    Sber = 'sberBankService',
}

export interface IPaymentFactory {
    createService(type: BankType): IPaymentProvider;
}