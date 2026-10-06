import { validateAmount } from "../src/validateAmount";
import { test, expect } from 'vitest'

test("Is 100", () => {
    expect(validateAmount(100)).toBe(true)
})

test("Is '100'", () => {
    expect(validateAmount("100")).toBe(false)
})

test("Is infinity", () => {
    expect(validateAmount(Infinity)).toBe(false)
})

test("Is -100", () => {
    expect(validateAmount(-100)).toBe(false)
})

test("Is 0", () => {
    expect(validateAmount(0)).toBe(false)
})

