import { Link, License, ViolationsItem } from './ISharedItems';

export interface IBlackDuckViolations{
    totalCount: number,
    items: ViolationsItem[],
    appliedFilters: [],
    _meta: {
    allow: string[],
    href: string,
    links: Link[]
    }
}