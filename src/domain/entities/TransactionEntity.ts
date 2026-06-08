/**
 * TransactionEntity — Pure domain model untuk Transaksi.
 */
export interface TransactionEntity {
    id: string;
    totalAmount: number;
    paymentMethod: 'CASH' | 'QRIS';
    status: 'COMPLETED' | 'REFUNDED';
    createdAt: Date;
}

export interface TransactionItemEntity {
    id: string;
    transactionId: string;
    menuId: string;
    quantity: number;
    subtotal: number;
    createdAt: Date;
}

/**
 * CartItemEntity — Item di keranjang sebelum menjadi transaksi.
 * Ini bukan data yang disimpan ke database, melainkan state sementara di memori.
 */
export interface CartItemEntity {
    menuId: string;
    name: string;
    price: number;
    qty: number;
}
