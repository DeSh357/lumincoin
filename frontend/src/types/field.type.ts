export type FieldType = {
    element: HTMLInputElement | null,
    options?: OptionType
}

export type OptionType = {
    pattern?: RegExp,
    compareTo?: string
}