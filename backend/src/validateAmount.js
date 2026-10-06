export function validateAmount(amountNumber) {
    return amountNumber > 0 && Number.isFinite(amountNumber)
}