import { MenuRepositoryImpl } from '../../data/repositories/MenuRepositoryImpl';
import { TransactionRepositoryImpl } from '../../data/repositories/TransactionRepositoryImpl';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { GetAllMenusUseCase, AddMenuUseCase, SyncMenusUseCase, DeleteMenuUseCase } from '../../domain/usecases/menu/MenuUseCases';
import { CreateTransactionUseCase, GetTransactionHistoryUseCase } from '../../domain/usecases/transaction/TransactionUseCases';
import { GetAnalyticsDataUseCase } from '../../domain/usecases/analytics/GetAnalyticsDataUseCase';
import { GetTopMenusUseCase } from '../../domain/usecases/analytics/GetTopMenusUseCase';

/**
 * DI Container — Satu tempat untuk membuat semua dependency.
 * Kalau besok mau ganti WatermelonDB dengan Realm, atau Supabase dengan Firebase,
 * cukup ganti implementasi di sini. Tidak perlu ubah domain atau presentation.
 */

// === Repository Instances ===
const menuRepository: IMenuRepository = new MenuRepositoryImpl();
const transactionRepository: ITransactionRepository = new TransactionRepositoryImpl();

// === Use Case Instances ===
export const getAllMenusUseCase = new GetAllMenusUseCase(menuRepository);
export const addMenuUseCase = new AddMenuUseCase(menuRepository);
export const syncMenusUseCase = new SyncMenusUseCase(menuRepository);
export const deleteMenuUseCase = new DeleteMenuUseCase(menuRepository);

export const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);
export const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);
export const getAnalyticsDataUseCase = new GetAnalyticsDataUseCase(transactionRepository, menuRepository);
export const getTopMenusUseCase = new GetTopMenusUseCase(transactionRepository, menuRepository);
