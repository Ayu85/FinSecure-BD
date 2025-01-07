-- CreateTable
CREATE TABLE "Customer" (
    "custId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankingId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "primaryAccountNumber" TEXT,
    "totalAssets" BIGINT NOT NULL DEFAULT 0,
    "twoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("custId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Account" (
    "accountNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Savings',
    "ownerId" INTEGER NOT NULL,
    "ifsc" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 10000,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "cvv" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "pin" INTEGER NOT NULL,
    "transactionLimit" INTEGER NOT NULL DEFAULT 100000,
    "accountNumber" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardNumber")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "walletId" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "ownerId" INTEGER NOT NULL,
    "walletName" TEXT NOT NULL DEFAULT 'Primary Wallet',

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("walletId")
);

-- CreateTable
CREATE TABLE "Nominee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "relation" TEXT NOT NULL,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "fromAccountNo" TEXT NOT NULL,
    "toAccountNo" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringDeposit" (
    "id" SERIAL NOT NULL,
    "installmentAmount" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "autoDebitAccount" TEXT NOT NULL,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "openingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maturityAmount" BIGINT NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "tenure" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "installmentsLeft" INTEGER NOT NULL DEFAULT 0,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RecurringDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "tenure" TIMESTAMP(3) NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "appliedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "accountNumber" TEXT NOT NULL,
    "totalInstallments" INTEGER NOT NULL DEFAULT 0,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "installmentsLeft" INTEGER NOT NULL DEFAULT 0,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanRepayment" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "repaymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanRepayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountNo_fkey" FOREIGN KEY ("fromAccountNo") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountNo_fkey" FOREIGN KEY ("toAccountNo") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringDeposit" ADD CONSTRAINT "RecurringDeposit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringDeposit" ADD CONSTRAINT "RecurringDeposit_autoDebitAccount_fkey" FOREIGN KEY ("autoDebitAccount") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRepayment" ADD CONSTRAINT "LoanRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
