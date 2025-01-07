export function generateBankAccountNumber () {
  // Generate a random number and convert it to a 12-digit string
  const accountNumber = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, '0')
  return accountNumber
}

export function generateIFSCCode () {
  const bankCode = 'FFIN'
  // '0' as the 5th character
  const zeroChar = '0'
  // Randomly generate the branch code (6 digits)
  const branchCode = Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, '0')

  // Combine all parts to form the IFSC code
  const ifscCode = bankCode + zeroChar + branchCode
  return ifscCode
}
export function generateInternetBankingID () {
  //  Generate a random 6-digit Internet Banking ID
  const bankingID = Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, '0')
  return bankingID
}
