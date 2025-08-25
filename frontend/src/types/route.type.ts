export type RouteType = {
    route: string,
    title: string,
    template: string,
    styles: string[],
    useLayout?: string,
    useAuth: boolean,
    load(): void
}