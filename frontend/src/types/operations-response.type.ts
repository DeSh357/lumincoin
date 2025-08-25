export type OperationsResponseType = {
    id: number,
    user_id: number,
    category_expense_id: null | number,
    category_income_id: null | number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type Operation = {
    income: number | null,
    expense: number | null,
}